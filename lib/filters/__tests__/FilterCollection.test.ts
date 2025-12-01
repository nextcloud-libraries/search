/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from 'vitest'
import { FilterCollection } from '../FilterCollection'
import type { Filter } from '../../types/filter'

describe('FilterCollection', () => {

	describe('constructor', () => {
		it('creates empty collection by default', () => {
			const collection = new FilterCollection()
			expect(collection.size).toBe(0)
		})

		it('creates collection from Map', () => {
			const filters = new Map<string, Filter>([
				['term', { name: 'term', type: 'string', value: 'test' }],
			])
			const collection = new FilterCollection(filters)
			expect(collection.size).toBe(1)
			expect(collection.get('term')).toBe('test')
		})
	})

	describe('has()', () => {
		it('returns true for existing filter', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
			]))
			expect(collection.has('term')).toBe(true)
		})

		it('returns false for non-existing filter', () => {
			const collection = new FilterCollection()
			expect(collection.has('term')).toBe(false)
		})
	})

	describe('get()', () => {
		it('returns filter value', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
			]))
			expect(collection.get('term')).toBe('test')
		})

		it('returns undefined for non-existing filter', () => {
			const collection = new FilterCollection()
			expect(collection.get('term')).toBeUndefined()
		})
	})

	describe('getTerm()', () => {
		it('returns term value', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'search query' }],
			]))
			expect(collection.getTerm()).toBe('search query')
		})

		it('returns empty string when no term', () => {
			const collection = new FilterCollection()
			expect(collection.getTerm()).toBe('')
		})
	})

	describe('getDateRange()', () => {
		it('returns date range with both dates', () => {
			const since = new Date('2025-01-01')
			const until = new Date('2025-12-31')
			const collection = new FilterCollection(new Map([
				['since', { name: 'since', type: 'datetime', value: since }],
				['until', { name: 'until', type: 'datetime', value: until }],
			]))

			const range = collection.getDateRange()
			expect(range).toEqual({ since, until })
		})

		it('returns date range with only since', () => {
			const since = new Date('2025-01-01')
			const collection = new FilterCollection(new Map([
				['since', { name: 'since', type: 'datetime', value: since }],
			]))

			const range = collection.getDateRange()
			expect(range).toEqual({ since, until: undefined })
		})

		it('returns null when no date filters', () => {
			const collection = new FilterCollection()
			expect(collection.getDateRange()).toBeNull()
		})
	})

	describe('getPerson()', () => {
		it('returns person value', () => {
			const person = { type: 'user' as const, id: 'admin' }
			const collection = new FilterCollection(new Map([
				['person', { name: 'person', type: 'person', value: person }],
			]))
			expect(collection.getPerson()).toEqual(person)
		})

		it('returns null when no person filter', () => {
			const collection = new FilterCollection()
			expect(collection.getPerson()).toBeNull()
		})
	})

	describe('with()', () => {
		it('creates new collection with additional filter', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
			]))

			const newCollection = collection.with('since', {
				name: 'since',
				type: 'datetime',
				value: new Date('2025-01-01'),
			})

			expect(collection.size).toBe(1)
			expect(newCollection.size).toBe(2)
			expect(newCollection.has('since')).toBe(true)
		})
	})

	describe('without()', () => {
		it('creates new collection without specified filter', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
				['since', { name: 'since', type: 'datetime', value: new Date() }],
			]))

			const newCollection = collection.without('since')

			expect(collection.size).toBe(2)
			expect(newCollection.size).toBe(1)
			expect(newCollection.has('since')).toBe(false)
		})
	})

	describe('toQueryParams()', () => {
		it('serializes string filter', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test query' }],
			]))

			const params = collection.toQueryParams()
			expect(params).toEqual({ term: 'test query' })
		})

		it('serializes datetime filter to ISO string', () => {
			const date = new Date('2025-01-15T10:30:00.000Z')
			const collection = new FilterCollection(new Map([
				['since', { name: 'since', type: 'datetime', value: date }],
			]))

			const params = collection.toQueryParams()
			expect(params).toEqual({ since: '2025-01-15T10:30:00.000Z' })
		})

		it('serializes boolean filter', () => {
			const collection = new FilterCollection(new Map([
				['title-only', { name: 'title-only', type: 'bool', value: true }],
			]))

			const params = collection.toQueryParams()
			expect(params).toEqual({ 'title-only': '1' })
		})

		it('serializes person filter', () => {
			const collection = new FilterCollection(new Map([
				['person', { name: 'person', type: 'person', value: { type: 'user', id: 'admin' } }],
			]))

			const params = collection.toQueryParams()
			expect(params).toEqual({ person: 'user:admin' })
		})
	})

	describe('fromQueryParams()', () => {
		const definitions = new Map([
			['term', { type: 'string' }],
			['since', { type: 'datetime' }],
			['title-only', { type: 'bool' }],
			['person', { type: 'person' }],
			['limit', { type: 'int' }],
		])

		it('parses string filter', () => {
			const collection = FilterCollection.fromQueryParams(
				{ term: 'test query' },
				definitions,
			)
			expect(collection.getTerm()).toBe('test query')
		})

		it('parses datetime filter', () => {
			const collection = FilterCollection.fromQueryParams(
				{ since: '2025-01-15T10:30:00.000Z' },
				definitions,
			)
			const range = collection.getDateRange()
			expect(range?.since?.toISOString()).toBe('2025-01-15T10:30:00.000Z')
		})

		it('parses boolean filter', () => {
			const collection = FilterCollection.fromQueryParams(
				{ 'title-only': '1' },
				definitions,
			)
			expect(collection.get('title-only')).toBe(true)
		})

		it('parses person filter', () => {
			const collection = FilterCollection.fromQueryParams(
				{ person: 'user:admin' },
				definitions,
			)
			expect(collection.getPerson()).toEqual({ type: 'user', id: 'admin' })
		})

		it('parses integer filter', () => {
			const collection = FilterCollection.fromQueryParams(
				{ limit: '25' },
				definitions,
			)
			expect(collection.get('limit')).toBe(25)
		})

		it('ignores unknown filters', () => {
			const collection = FilterCollection.fromQueryParams(
				{ unknown: 'value' },
				definitions,
			)
			expect(collection.size).toBe(0)
		})
	})

	describe('iteration', () => {
		it('is iterable', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
				['since', { name: 'since', type: 'datetime', value: new Date() }],
			]))

			const entries = [...collection]
			expect(entries).toHaveLength(2)
		})

		it('keys() returns filter names', () => {
			const collection = new FilterCollection(new Map([
				['term', { name: 'term', type: 'string', value: 'test' }],
				['since', { name: 'since', type: 'datetime', value: new Date() }],
			]))

			expect(collection.keys()).toEqual(['term', 'since'])
		})
	})

})
