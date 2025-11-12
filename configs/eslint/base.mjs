import antfu from '@antfu/eslint-config'

/**
 * @param {Parameters<typeof antfu>[0]} options
 * @returns Antfu's config
 */
export function base(options) {
  return antfu({
    formatters: true,
    isInEditor: false,
    rules: {
      'antfu/curly': ['off'],
      'antfu/if-newline': ['off'],

      'curly': ['error', 'multi-line', 'consistent'],
      'style/brace-style': ['error', '1tbs'],
      'style/jsx-one-expression-per-line': ['error', { allow: 'non-jsx' }],

      'test/no-import-node-test': ['off'],
    },
    ...options,
  })
}
