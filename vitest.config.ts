import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['{apps,configs,packages}/*'],
    api: {
      port: 7357,
    },
    coverage: {
      include: ['packages/*/src'],
    },
  },
})
