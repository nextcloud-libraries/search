/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * A highlighted fragment showing where a match occurred
 */
export interface SearchHighlight {
	field: string
	fragments: string[]
}

/**
 * A single search result entry
 */
export interface SearchResultEntry {
	id: string
	providerId: string
	score: number
	title: string
	subline: string
	resourceUrl: string
	thumbnailUrl?: string
	icon?: string
	rounded?: boolean
	highlights?: SearchHighlight[]
	attributes: Record<string, unknown>
}

/**
 * Result set from a single provider
 */
export interface ProviderSearchResult {
	name: string
	isPaginated: boolean
	entries: SearchResultEntry[]
	cursor?: string | number
}

/**
 * Aggregated results from multiple providers
 */
export interface AggregatedSearchResult {
	entries: SearchResultEntry[]
	byProvider: Map<string, ProviderSearchResult>
	totalCount: number
	hasMore: boolean
}
