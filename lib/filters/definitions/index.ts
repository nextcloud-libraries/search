/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { FilterDefinition } from '../../types/filter'

/**
 * Built-in filter definitions matching Nextcloud's unified search
 */
export const BUILTIN_FILTERS: ReadonlyMap<string, FilterDefinition> = new Map([
	['term', {
		name: 'term',
		type: 'string',
		label: 'Search term',
		exclusive: false,
	}],
	['since', {
		name: 'since',
		type: 'datetime',
		label: 'From date',
		exclusive: false,
	}],
	['until', {
		name: 'until',
		type: 'datetime',
		label: 'To date',
		exclusive: false,
	}],
	['person', {
		name: 'person',
		type: 'person',
		label: 'Person',
		exclusive: false,
	}],
	['title-only', {
		name: 'title-only',
		type: 'bool',
		label: 'Title only',
		exclusive: false,
	}],
	['places', {
		name: 'places',
		type: 'string',
		label: 'Location',
		exclusive: false,
	}],
	['provider', {
		name: 'provider',
		type: 'string',
		label: 'Provider',
		exclusive: false,
	}],
])

/**
 * Get a built-in filter definition by name
 */
export function getBuiltinFilter(name: string): FilterDefinition | undefined {
	return BUILTIN_FILTERS.get(name)
}

/**
 * Check if a filter name is a built-in filter
 */
export function isBuiltinFilter(name: string): boolean {
	return BUILTIN_FILTERS.has(name)
}
