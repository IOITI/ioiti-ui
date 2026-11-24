import { readFileSync } from 'node:fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

import { packageAliases } from './gallery/aliases.ts'

// The tests need the Node of .nvmrc: their jsdom asks for a recent one (22.22.2, 24.15 or later), and an older Node
// fails every test file with an error of its own. Said here once instead; `nvm use` gives the Node of .nvmrc.
const wanted = Number(readFileSync(new URL('.nvmrc', import.meta.url), 'utf8').trim())
if (Number(process.versions.node.split('.')[0]) < wanted) {
  throw new Error(`Node ${process.versions.node} runs the tests, which need Node ${wanted} (.nvmrc): nvm use, then again`)
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
