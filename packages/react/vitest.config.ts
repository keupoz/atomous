import { defineProject } from '@atomous/vitest-config'

export default defineProject({
  test: {
    name: {
      label: 'react',
      color: 'blue',
    },
    environment: 'jsdom',
  },
})
