import { defineProject } from '@atomous/vitest-config'
import solid from 'vite-plugin-solid'

export default defineProject({
  plugins: [solid()],
  test: {
    name: {
      label: 'solid',
      color: 'blue',
    },
    deps: {
      optimizer: {
        client: {
          // For some reason reactivity doesn't work without this
          enabled: true,
        },
      },
    },
    server: {
      deps: {
        // Fixes the error about calling client-only API
        inline: ['@solidjs/testing-library'],
      },
    },
  },
})
