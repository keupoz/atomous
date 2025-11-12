import { defineProject } from '@atomous/vitest-config'

export default defineProject({
  test: {
    name: {
      label: 'core',
      color: 'green',
    },
    execArgv: ['--expose-gc'],
  },
})
