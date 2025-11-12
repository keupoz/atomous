import { defineProject } from '@atomous/vitest-config'

export default defineProject({
  test: {
    name: {
      label: 'persistent',
      color: 'yellow',
    },
    environment: 'jsdom',
    execArgv: ['--expose-gc'],
  },
})
