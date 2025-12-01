/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

module.exports = {
	extends: [
		'@nextcloud/eslint-config/typescript',
	],
	ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
	rules: {
		'jsdoc/require-param': 'off',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-jsdoc': 'off',
	},
}
