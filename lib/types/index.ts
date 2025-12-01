/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export type {
	FilterType,
	FilterValue,
	Filter,
	FilterDefinition,
	FilterDefinitionOptions,
	DateRange,
	PersonValue,
} from './filter'

export type {
	SearchHighlight,
	SearchResultEntry,
	ProviderSearchResult,
	AggregatedSearchResult,
} from './result'

export type {
	SortOrder,
	SearchQuery,
	SearchQueryOptions,
	ParsedFilters,
} from './query'

export type {
	RouteContext,
	SearchProvider,
	ProviderInfo,
	SearchClient,
} from './provider'
