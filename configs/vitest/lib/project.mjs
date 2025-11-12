import { mergeConfig, defineProject as vitestProject } from 'vitest/config'

/**
 * @param {import('vitest/config').UserWorkspaceConfig} config
 */
export function defineProject(config) {
  return mergeConfig(
    vitestProject({
      test: {
        include: ['./{src,test}/**\/*.{test,spec}.?(c|m)[jt]s?(x)'],
      },
      resolve: {
        conditions: ['@atomous/source'],
      },
    }),
    vitestProject(config),
  )
}
