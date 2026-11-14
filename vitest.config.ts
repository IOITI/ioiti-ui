import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { packageAliases } from './gallery/aliases.ts'

export default defineConfig({
  plugins: [react()],
  // The gallery's tests import `ioiti-ui` as the gallery does: the package's source.
  resolve: { alias: packageAliases('src') },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Not kept between runs: a file transformed with its import.meta.glob (the gallery's examples, its categories)
    // would not see a file added or removed since.
    fsModuleCache: false,
    include: ['src/**/*.test.{ts,tsx}', 'gallery/src/**/*.test.{ts,tsx}'],
  },
})
