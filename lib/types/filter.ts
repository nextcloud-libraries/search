/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Supported filter value types
 */
export type FilterType =
	| 'string'
	| 'int'
	| 'float'
	| 'bool'
	| 'datetime'
	| 'person'
	| 'strings'

/**
 * A date range with optional bounds
 */
export interface DateRange {
	since?: Date
	until?: Date
}

/**
 * A person/user filter value
 */
export interface PersonValue {
	id: string
	type: 'user' | 'group' | 'email'
	displayName?: string
}

/**
 * Union of all possible filter values
 */
export type FilterValue =
	| string
	| number
	| boolean
	| Date
	| PersonValue
	| string[]

/**
 * A single filter instance with name and value
 */
export interface Filter<T extends FilterValue = FilterValue> {
	readonly name: string
	readonly type: FilterType
	readonly value: T
}

/**
 * Schema definition for a filter type
 */
export interface FilterDefinition {
	readonly name: string
	readonly type: FilterType
	readonly label?: string
	readonly exclusive?: boolean
}

/**
 * Options for creating a filter definition
 */
export interface FilterDefinitionOptions {
	label?: string
	exclusive?: boolean
}
