import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { packageAliases } from './gallery/aliases.ts'

// jsdom's dependencies are ES modules it requires from CommonJS, which Node does from 22.12 (20.19 on its line): said
// here, rather than in an error per test file. `nvm use` gives the Node of .nvmrc.
const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 12)) {
  throw new Error(`Node ${process.versions.node} runs the tests, which need Node 22.12 or later: nvm use (.nvmrc), then again`)
}

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
