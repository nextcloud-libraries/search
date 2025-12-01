/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Types
export type {
	FilterType,
	FilterValue,
	Filter,
	FilterDefinition,
	FilterDefinitionOptions,
	DateRange,
	PersonValue,
	SearchHighlight,
	SearchResultEntry,
	ProviderSearchResult,
	AggregatedSearchResult,
	SortOrder,
	SearchQuery,
	SearchQueryOptions,
	ParsedFilters,
	RouteContext,
	SearchProvider,
	ProviderInfo,
	SearchClient,
} from './types/index'

// Filter classes
export { FilterCollection } from './filters/FilterCollection'
export { FilterBuilder } from './filters/FilterBuilder'

// Built-in filter definitions
export {
	BUILTIN_FILTERS,
	getBuiltinFilter,
	isBuiltinFilter,
} from './filters/definitions/index'
