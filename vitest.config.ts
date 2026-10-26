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
    include: ['src/**/*.test.{ts,tsx}', 'gallery/src/**/*.test.{ts,tsx}'],
  },
})
