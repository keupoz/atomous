import { defineProject } from '@atomous/vitest-config'

export default defineProject({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    name: {
      label: 'preact',
      color: 'magenta',
    },
    environment: 'jsdom',
  },
})
