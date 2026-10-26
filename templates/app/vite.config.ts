import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ioiti } from 'ioiti-ui/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // ioiti(): the theme set before the first paint, under this application's own key, and what a
  // strict Content-Security-Policy needs (no inline script, no font as a data: URI).
  plugins: [react(), tailwindcss(), ioiti({ themeStorageKey: 'my-app.theme' })],
})
