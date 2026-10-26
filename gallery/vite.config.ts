import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { ioiti } from '../src/vite/index.ts'
import { packageAliases } from './aliases.ts'

// The gallery is an application made with ioiti-ui, as the template is: it imports `ioiti-ui`
// alone. In development that is the package's source; `build:gallery` (--mode dist) builds it
// on dist/, as an application would get it.
export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss(), ioiti({ themeStorageKey: 'ioiti-gallery.theme' })],
  resolve: { alias: packageAliases(mode === 'dist' ? 'dist' : 'src') },
  build: { outDir: 'dist', emptyOutDir: true },
  server: { port: 5180 },
}))
