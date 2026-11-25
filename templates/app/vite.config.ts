/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ioiti } from 'ioiti-ui/vite'
import { defineConfig } from 'vite'

// The policy the server sends with the application's pages (README, Content-Security-Policy): nothing from another
// origin, no inline script.
const CONTENT_SECURITY_POLICY =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"

export default defineConfig({
  // ioiti(): the theme set before the first paint, under this application's own key, and what a
  // strict Content-Security-Policy needs (no inline script, no font as a data: URI).
  plugins: [react(), tailwindcss(), ioiti({ themeStorageKey: 'my-app.theme' })],
  // `npm run preview` serves the build under that policy, as the server will: what it refuses shows on the browser's
  // console. Not `npm run dev`, whose React Refresh runs an inline script.
  preview: { headers: { 'Content-Security-Policy': CONTENT_SECURITY_POLICY } },
  // `npm test`: Vitest, the pages drawn in jsdom.
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'] },
})
