/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['lib/**/__tests__/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: ['lib/**/*.ts'],
			exclude: ['lib/**/__tests__/**'],
		},
	},
})
