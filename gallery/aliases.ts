import { fileURLToPath } from 'node:url'

import type { Alias } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))

/**
 * `ioiti-ui` as an application imports it, pointed at the package's source (the gallery in
 * development, the tests) or at what `npm run build` made of it (`build:gallery`, which checks the
 * built package too). A stylesheet keeps its query (`?raw`).
 */
export function packageAliases(from: 'src' | 'dist'): Alias[] {
  const at = (path: string) => `${root}${from}/${path}`
  const script = from === 'src' ? 'ts' : 'js'
  return [
    { find: /^ioiti-ui\/(styles|design|tokens|theme|accents|glass)\.css(\?.*)?$/, replacement: `${at('styles')}/$1.css$2` },
    { find: /^ioiti-ui\/react-router$/, replacement: at(`react-router/index.${script}`) },
    { find: /^ioiti-ui$/, replacement: at(`index.${script}`) },
  ]
}
