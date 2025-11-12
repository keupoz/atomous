import { defineProject } from '@atomous/vitest-config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineProject({
  plugins: [svelte(), svelteTesting()],
  test: {
    name: {
      label: 'svelte',
      color: 'red',
    },
    environment: 'jsdom',
  },
})
