import { defineProject } from '@atomous/vitest-config'

export default defineProject({
  test: {
    name: {
      label: 'vue',
      color: 'green',
    },
    environment: 'jsdom',
  },
})
