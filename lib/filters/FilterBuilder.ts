/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Filter, FilterType, DateRange, PersonValue } from '../types/filter'
import { FilterCollection } from './FilterCollection'

/**
 * Fluent builder for constructing filter collections
 */
export class FilterBuilder {

	private filters: Map<string, Filter> = new Map()

	/**
	 * Set the search term
	 */
	term(value: string): this {
		if (value.trim()) {
			this.filters.set('term', {
				name: 'term',
				type: 'string',
				value: value.trim(),
			})
		}
		return this
	}

	/**
	 * Set a date range filter
	 */
	dateRange(range: DateRange): this {
		if (range.since) {
			this.filters.set('since', {
				name: 'since',
				type: 'datetime',
				value: range.since,
			})
		}
		if (range.until) {
			this.filters.set('until', {
				name: 'until',
				type: 'datetime',
				value: range.until,
			})
		}
		return this
	}

	/**
	 * Filter results from the last N days
	 */
	lastDays(days: number): this {
		const now = new Date()
		const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
		return this.dateRange({ since, until: now })
	}

	/**
	 * Filter results from today
	 */
	today(): this {
		const now = new Date()
		const since = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		return this.dateRange({ since, until: now })
	}

	/**
	 * Filter results from this week
	 */
	thisWeek(): this {
		const now = new Date()
		const day = now.getDay()
		const diff = now.getDate() - day + (day === 0 ? -6 : 1)
		const since = new Date(now.getFullYear(), now.getMonth(), diff)
		return this.dateRange({ since, until: now })
	}

	/**
	 * Filter results from this month
	 */
	thisMonth(): this {
		const now = new Date()
		const since = new Date(now.getFullYear(), now.getMonth(), 1)
		return this.dateRange({ since, until: now })
	}

	/**
	 * Filter results from this year
	 */
	thisYear(): this {
		const now = new Date()
		const since = new Date(now.getFullYear(), 0, 1)
		return this.dateRange({ since, until: now })
	}

	/**
	 * Filter by person (user, group, or email)
	 */
	person(value: PersonValue): this {
		this.filters.set('person', {
			name: 'person',
			type: 'person',
			value,
		})
		return this
	}

	/**
	 * Filter by Nextcloud user ID
	 */
	user(userId: string): this {
		return this.person({ type: 'user', id: userId })
	}

	/**
	 * Set a custom string filter
	 */
	string(name: string, value: string): this {
		this.filters.set(name, {
			name,
			type: 'string',
			value,
		})
		return this
	}

	/**
	 * Set a custom integer filter
	 */
	int(name: string, value: number): this {
		this.filters.set(name, {
			name,
			type: 'int',
			value: Math.floor(value),
		})
		return this
	}

	/**
	 * Set a custom boolean filter
	 */
	bool(name: string, value: boolean): this {
		this.filters.set(name, {
			name,
			type: 'bool',
			value,
		})
		return this
	}

	/**
	 * Set a custom filter with explicit type
	 */
	custom<T extends Filter['value']>(name: string, type: FilterType, value: T): this {
		this.filters.set(name, { name, type, value })
		return this
	}

	/**
	 * Remove a filter
	 */
	remove(name: string): this {
		this.filters.delete(name)
		return this
	}

	/**
	 * Clear all filters
	 */
	clear(): this {
		this.filters.clear()
		return this
	}

	/**
	 * Build the immutable filter collection
	 */
	build(): FilterCollection {
		return new FilterCollection(this.filters)
	}

}
