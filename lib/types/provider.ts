/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FilterDefinition } from './filter'
import type { SearchQuery } from './query'
import type { ProviderSearchResult } from './result'

export interface RouteContext {
	route: string
	parameters: Record<string, string>
}

export interface SearchProvider {
	readonly id: string
	readonly name: string
	readonly icon: string
	readonly appId: string
	getOrder(context: RouteContext): number | null
	getSupportedFilters(): string[]
	getCustomFilters?(): FilterDefinition[]
	getAlternateIds?(): string[]
	isExternal?: boolean
	supportsInAppSearch?: boolean
}

export interface ProviderInfo {
	id: string
	appId: string
	name: string
	icon: string
	order: number
	triggers: string[]
	filters: Record<string, string>
	inAppSearch: boolean
	isExternal: boolean
}

export interface SearchClient {
	getProviders(route?: string): Promise<ProviderInfo[]>
	search(providerId: string, query: SearchQuery): Promise<ProviderSearchResult>
	searchAll(query: SearchQuery): Promise<Map<string, ProviderSearchResult>>
}
