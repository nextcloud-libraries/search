/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { FilterBuilder } from '../FilterBuilder'

describe('FilterBuilder', () => {

	describe('term()', () => {
		it('sets term filter', () => {
			const collection = new FilterBuilder()
				.term('search query')
				.build()

			expect(collection.getTerm()).toBe('search query')
		})

		it('trims whitespace', () => {
			const collection = new FilterBuilder()
				.term('  search query  ')
				.build()

			expect(collection.getTerm()).toBe('search query')
		})

		it('ignores empty term', () => {
			const collection = new FilterBuilder()
				.term('   ')
				.build()

			expect(collection.has('term')).toBe(false)
		})
	})

	describe('dateRange()', () => {
		it('sets both since and until', () => {
			const since = new Date('2025-01-01')
			const until = new Date('2025-12-31')

			const collection = new FilterBuilder()
				.dateRange({ since, until })
				.build()

			const range = collection.getDateRange()
			expect(range?.since).toEqual(since)
			expect(range?.until).toEqual(until)
		})

		it('sets only since when until is undefined', () => {
			const since = new Date('2025-01-01')

			const collection = new FilterBuilder()
				.dateRange({ since })
				.build()

			expect(collection.has('since')).toBe(true)
			expect(collection.has('until')).toBe(false)
		})

		it('sets only until when since is undefined', () => {
			const until = new Date('2025-12-31')

			const collection = new FilterBuilder()
				.dateRange({ until })
				.build()

			expect(collection.has('since')).toBe(false)
			expect(collection.has('until')).toBe(true)
		})
	})

	describe('lastDays()', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('sets range for last 7 days', () => {
			const collection = new FilterBuilder()
				.lastDays(7)
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.toISOString()).toBe('2025-06-08T12:00:00.000Z')
			expect(range?.until?.toISOString()).toBe('2025-06-15T12:00:00.000Z')
		})

		it('sets range for last 30 days', () => {
			const collection = new FilterBuilder()
				.lastDays(30)
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.toISOString()).toBe('2025-05-16T12:00:00.000Z')
		})
	})

	describe('today()', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date('2025-06-15T14:30:00.000Z'))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('sets range for today', () => {
			const collection = new FilterBuilder()
				.today()
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.getFullYear()).toBe(2025)
			expect(range?.since?.getMonth()).toBe(5)
			expect(range?.since?.getDate()).toBe(15)
		})
	})

	describe('thisWeek()', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('sets range for current week starting Monday', () => {
			const collection = new FilterBuilder()
				.thisWeek()
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.getDate()).toBe(9)
		})
	})

	describe('thisMonth()', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('sets range for current month', () => {
			const collection = new FilterBuilder()
				.thisMonth()
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.getFullYear()).toBe(2025)
			expect(range?.since?.getMonth()).toBe(5)
			expect(range?.since?.getDate()).toBe(1)
		})
	})

	describe('thisYear()', () => {
		beforeEach(() => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('sets range for current year', () => {
			const collection = new FilterBuilder()
				.thisYear()
				.build()

			const range = collection.getDateRange()
			expect(range?.since?.getFullYear()).toBe(2025)
			expect(range?.since?.getMonth()).toBe(0)
			expect(range?.since?.getDate()).toBe(1)
		})
	})

	describe('person()', () => {
		it('sets person filter', () => {
			const collection = new FilterBuilder()
				.person({ type: 'user', id: 'admin', displayName: 'Administrator' })
				.build()

			expect(collection.getPerson()).toEqual({
				type: 'user',
				id: 'admin',
				displayName: 'Administrator',
			})
		})
	})

	describe('user()', () => {
		it('sets user filter as person type', () => {
			const collection = new FilterBuilder()
				.user('admin')
				.build()

			expect(collection.getPerson()).toEqual({ type: 'user', id: 'admin' })
		})
	})

	describe('custom filters', () => {
		it('sets string filter', () => {
			const collection = new FilterBuilder()
				.string('path', '/Documents')
				.build()

			expect(collection.get('path')).toBe('/Documents')
		})

		it('sets integer filter', () => {
			const collection = new FilterBuilder()
				.int('min-size', 1024)
				.build()

			expect(collection.get('min-size')).toBe(1024)
		})

		it('floors float to integer', () => {
			const collection = new FilterBuilder()
				.int('min-size', 1024.7)
				.build()

			expect(collection.get('min-size')).toBe(1024)
		})

		it('sets boolean filter', () => {
			const collection = new FilterBuilder()
				.bool('is-favorite', true)
				.build()

			expect(collection.get('is-favorite')).toBe(true)
		})

		it('sets custom typed filter', () => {
			const collection = new FilterBuilder()
				.custom('tags', 'strings', ['important', 'work'])
				.build()

			expect(collection.get('tags')).toEqual(['important', 'work'])
		})
	})

	describe('remove()', () => {
		it('removes a filter', () => {
			const collection = new FilterBuilder()
				.term('test')
				.lastDays(7)
				.remove('since')
				.build()

			expect(collection.has('term')).toBe(true)
			expect(collection.has('since')).toBe(false)
			expect(collection.has('until')).toBe(true)
		})
	})

	describe('clear()', () => {
		it('removes all filters', () => {
			const collection = new FilterBuilder()
				.term('test')
				.lastDays(7)
				.user('admin')
				.clear()
				.build()

			expect(collection.size).toBe(0)
		})
	})

	describe('chaining', () => {
		it('supports method chaining', () => {
			const collection = new FilterBuilder()
				.term('quarterly report')
				.thisYear()
				.user('admin')
				.bool('title-only', true)
				.build()

			expect(collection.size).toBe(5)
			expect(collection.getTerm()).toBe('quarterly report')
			expect(collection.getPerson()?.id).toBe('admin')
			expect(collection.get('title-only')).toBe(true)
		})
	})

})
