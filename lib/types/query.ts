/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Filter, DateRange, PersonValue } from './filter'

export type SortOrder = 'relevance' | 'date' | 'title'

export interface SearchQuery {
	term: string
	filters: ReadonlyMap<string, Filter>
	limit: number
	cursor?: string | number
	providers?: string[]
	sortOrder?: SortOrder
	route?: string
	routeParameters?: Record<string, string>
}

export interface SearchQueryOptions {
	limit?: number
	cursor?: string | number
	providers?: string[]
	sortOrder?: SortOrder
	route?: string
	routeParameters?: Record<string, string>
}

export interface ParsedFilters {
	getTerm(): string
	getDateRange(): DateRange | null
	getPerson(): PersonValue | null
	has(name: string): boolean
	get<T>(name: string): T | null
	keys(): string[]
}
