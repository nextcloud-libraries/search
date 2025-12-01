/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Filter, FilterValue, DateRange, PersonValue } from '../types/filter'

/**
 * Immutable collection of search filters with typed accessors
 */
export class FilterCollection implements Iterable<[string, Filter]> {

	private readonly filters: Map<string, Filter>

	constructor(filters?: Map<string, Filter> | Iterable<[string, Filter]>) {
		this.filters = new Map(filters)
	}

	get size(): number {
		return this.filters.size
	}

	has(name: string): boolean {
		return this.filters.has(name)
	}

	get<T extends FilterValue = FilterValue>(name: string): T | undefined {
		return this.filters.get(name)?.value as T | undefined
	}

	getFilter(name: string): Filter | undefined {
		return this.filters.get(name)
	}

	getTerm(): string {
		return this.get<string>('term') ?? ''
	}

	getDateRange(): DateRange | null {
		const since = this.get<Date>('since')
		const until = this.get<Date>('until')
		if (!since && !until) {
			return null
		}
		return { since, until }
	}

	getPerson(): PersonValue | null {
		return this.get<PersonValue>('person') ?? null
	}

	keys(): string[] {
		return Array.from(this.filters.keys())
	}

	values(): Filter[] {
		return Array.from(this.filters.values())
	}

	entries(): [string, Filter][] {
		return Array.from(this.filters.entries())
	}

	[Symbol.iterator](): Iterator<[string, Filter]> {
		return this.filters[Symbol.iterator]()
	}

	/**
	 * Create a new collection with an additional filter
	 */
	with(name: string, filter: Filter): FilterCollection {
		const newFilters = new Map(this.filters)
		newFilters.set(name, filter)
		return new FilterCollection(newFilters)
	}

	/**
	 * Create a new collection without the specified filter
	 */
	without(name: string): FilterCollection {
		const newFilters = new Map(this.filters)
		newFilters.delete(name)
		return new FilterCollection(newFilters)
	}

	/**
	 * Serialize filters to URL query parameters
	 */
	toQueryParams(): Record<string, string> {
		const params: Record<string, string> = {}
		for (const [name, filter] of this.filters) {
			params[name] = serializeFilterValue(filter.value, filter.type)
		}
		return params
	}

	/**
	 * Create a new FilterCollection from query parameters
	 */
	static fromQueryParams(
		params: Record<string, string>,
		definitions: Map<string, { type: string }>,
	): FilterCollection {
		const filters = new Map<string, Filter>()
		for (const [name, value] of Object.entries(params)) {
			const def = definitions.get(name)
			if (!def) continue
			const parsed = parseFilterValue(value, def.type)
			if (parsed !== undefined) {
				filters.set(name, {
					name,
					type: def.type as Filter['type'],
					value: parsed,
				})
			}
		}
		return new FilterCollection(filters)
	}

}

function serializeFilterValue(value: FilterValue, type: string): string {
	switch (type) {
	case 'datetime':
		return (value as Date).toISOString()
	case 'bool':
		return value ? '1' : '0'
	case 'person': {
		const person = value as PersonValue
		return `${person.type}:${person.id}`
	}
	case 'strings':
		return (value as string[]).join(',')
	default:
		return String(value)
	}
}

function parseFilterValue(value: string, type: string): FilterValue | undefined {
	switch (type) {
	case 'datetime': {
		const date = new Date(value)
		return isNaN(date.getTime()) ? undefined : date
	}
	case 'bool':
		return value === '1' || value === 'true'
	case 'int': {
		const int = parseInt(value, 10)
		return isNaN(int) ? undefined : int
	}
	case 'float': {
		const float = parseFloat(value)
		return isNaN(float) ? undefined : float
	}
	case 'person': {
		const [personType, id] = value.split(':', 2)
		if (!id) return undefined
		return { type: personType as PersonValue['type'], id }
	}
	case 'strings':
		return value.split(',').filter(Boolean)
	default:
		return value
	}
}
