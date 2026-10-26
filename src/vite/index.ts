import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { searchForWorkspaceRoot } from 'vite'
import type { HtmlTagDescriptor, Plugin, UserConfig } from 'vite'

// The accents and materials of src/lib/theme.ts, which this Node-side module cannot import (its
// tests hold the two lists equal).
const ACCENTS = ['neutral', 'violet', 'indigo', 'blue'] as const
const MATERIALS = ['flat', 'glass'] as const

export interface IoitiPluginOptions {
  /**
   * Where the theme chosen with the button is kept in the browser (localStorage): one key per
   * application, or two applications on one domain share their choice. `ioiti.theme` by default.
   */
  themeStorageKey?: string
  /** The file the pre-paint theme script is served and written as, at the root of the site. */
  themeScript?: string
  /**
   * The application's accent, shown from the first paint until a person picks another (LookPicker):
   * the colour of what is chosen, current or primary. `neutral` by default, the design's ink.
   */
  accent?: (typeof ACCENTS)[number]
  /**
   * The application's material, shown until a person picks another: `flat` by default, `glass` for
   * translucent surfaces over a colour backdrop.
   */
  material?: (typeof MATERIALS)[number]
}

export const DEFAULT_THEME_SCRIPT = 'ioiti-theme.js'

function checked<T extends string>(name: string, values: readonly T[], value: T | undefined): T | undefined {
  if (value === undefined || values.includes(value)) return value
  throw new Error(`ioiti(): the ${name} is one of ${values.join(', ')}, not "${value}"`)
}

/**
 * What an application built with Vite needs for ioiti-ui, and would otherwise do by hand:
 *
 * - the pre-paint theme script (`theme.js`), served and written beside the pages, and its tag at
 *   the top of `<head>`, with the application's storage key, accent and material: the page is
 *   painted in its theme from the first frame, and a strict Content-Security-Policy (no inline
 *   script) holds;
 * - no file inlined as a `data:` URI unless the application says otherwise: the smallest font
 *   files are under Vite's 4 kB limit, and `font-src 'self'` refuses a font given as data;
 * - one React and one framer-motion, the application's, even through a `file:` link to the
 *   package (whose own folder has copies of them for its tests);
 * - the package's folder allowed to the dev server, for its fonts, through such a link.
 */
export function ioiti(options: IoitiPluginOptions = {}): Plugin {
  const fileName = options.themeScript ?? DEFAULT_THEME_SCRIPT
  const storageKey = options.themeStorageKey ?? 'ioiti.theme'
  const accent = checked('accent', ACCENTS, options.accent)
  const material = checked('material', MATERIALS, options.material)
  // dist/vite/index.js reads dist/theme.js; in the package's own gallery, src/vite reads src/theme.js.
  const source = readFileSync(new URL('../theme.js', import.meta.url), 'utf8')
  const packageRoot = realpathSync(fileURLToPath(new URL('../..', import.meta.url)))
  let base = '/'

  return {
    name: 'ioiti-ui',

    config(config) {
      const root = config.root ?? process.cwd()
      const added: UserConfig = {
        resolve: { dedupe: ['react', 'react-dom', 'framer-motion'] },
        // Merged with the application's own list. Without one, Vite allows the workspace alone.
        server: { fs: { allow: [searchForWorkspaceRoot(root), packageRoot] } },
      }
      if (config.build?.assetsInlineLimit === undefined) added.build = { assetsInlineLimit: 0 }
      return added
    },

    configResolved(config) {
      base = config.base
    },

    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== `${base}${fileName}`) return next()
        response.setHeader('Content-Type', 'text/javascript')
        response.end(source)
      })
    },

    transformIndexHtml() {
      const attrs: Record<string, string> = { src: `${base}${fileName}`, 'data-storage-key': storageKey }
      // The application's accent and material, read by the script: written only when given.
      if (accent) attrs['data-accent'] = accent
      if (material) attrs['data-material'] = material
      const tag: HtmlTagDescriptor = { tag: 'script', attrs, injectTo: 'head-prepend' }
      return [tag]
    },

    generateBundle() {
      this.emitFile({ type: 'asset', fileName, source })
    },
  }
}
