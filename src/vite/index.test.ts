// @vitest-environment node
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import type { IndexHtmlTransformResult, Plugin, ResolvedConfig, UserConfig } from 'vite'
import { describe, expect, it, vi } from 'vitest'

import { ACCENTS, MATERIALS } from '../lib/theme.js'
import type { Accent, Material } from '../lib/theme.js'

import { DEFAULT_THEME_SCRIPT, ioiti } from './index.js'
import type { IoitiPluginOptions } from './index.js'

// The plugin's options name the accents and materials of the application's side, no more, no fewer.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const accentsAgree: Same<NonNullable<IoitiPluginOptions['accent']>, Accent> = true
const materialsAgree: Same<NonNullable<IoitiPluginOptions['material']>, Material> = true

const SCRIPT = readFileSync(new URL('../theme.js', import.meta.url), 'utf8')
const PACKAGE = realpathSync(fileURLToPath(new URL('../..', import.meta.url)))

// A plugin's hooks are functions here; Vite calls them with its own context, which these do not use.
type Hook = (...args: unknown[]) => unknown
const hook = (plugin: Plugin, name: keyof Plugin) => plugin[name] as unknown as Hook

function configured(plugin: Plugin, config: UserConfig = {}): UserConfig {
  return hook(plugin, 'config')(config, { command: 'build', mode: 'production' }) as UserConfig
}

function resolved(plugin: Plugin, base = '/') {
  hook(plugin, 'configResolved')({ base } as ResolvedConfig)
}

function tags(plugin: Plugin) {
  return hook(plugin, 'transformIndexHtml')('<html></html>', {}) as Extract<IndexHtmlTransformResult, unknown[]>
}

describe('the plugin of an application built with Vite', () => {
  it('writes the pre-paint theme script\'s tag first in <head>, with the application\'s key', () => {
    const plugin = ioiti({ themeStorageKey: 'my-app.theme' })
    resolved(plugin)

    expect(tags(plugin)).toEqual([
      { tag: 'script', attrs: { src: `/${DEFAULT_THEME_SCRIPT}`, 'data-storage-key': 'my-app.theme' }, injectTo: 'head-prepend' },
    ])
  })

  it('gives the script the application\'s accent and material, when it has them', () => {
    const plugin = ioiti({ themeStorageKey: 'my-app.theme', accent: 'violet', material: 'glass' })
    resolved(plugin)

    expect(tags(plugin)[0].attrs).toEqual({
      src: `/${DEFAULT_THEME_SCRIPT}`,
      'data-storage-key': 'my-app.theme',
      'data-accent': 'violet',
      'data-material': 'glass',
    })
  })

  it('takes every accent and material of the package, and refuses anything else by name', () => {
    expect(accentsAgree && materialsAgree).toBe(true)
    for (const accent of ACCENTS) expect(() => ioiti({ accent })).not.toThrow()
    for (const material of MATERIALS) expect(() => ioiti({ material })).not.toThrow()
    // As a configuration written in JavaScript could give them.
    expect(() => ioiti({ accent: 'sepia' } as unknown as IoitiPluginOptions)).toThrow(
      'ioiti(): the accent is one of neutral, violet, indigo, blue, not "sepia"',
    )
    expect(() => ioiti({ material: 'paper' } as unknown as IoitiPluginOptions)).toThrow('the material is one of flat, glass')
  })

  it('serves it under the site\'s base and the name it is given, with the default key otherwise', () => {
    const plugin = ioiti({ themeScript: 'theme.js' })
    resolved(plugin, '/app/')

    expect(tags(plugin)[0]).toMatchObject({ attrs: { src: '/app/theme.js', 'data-storage-key': 'ioiti.theme' } })
  })

  it('writes the package\'s own script beside the pages', () => {
    const plugin = ioiti()
    const emitFile = vi.fn()

    hook(plugin, 'generateBundle').call({ emitFile })

    expect(emitFile).toHaveBeenCalledWith({ type: 'asset', fileName: DEFAULT_THEME_SCRIPT, source: SCRIPT })
  })

  it('serves it in development, and leaves every other request to the server', () => {
    const plugin = ioiti()
    resolved(plugin)
    let middleware: Hook = () => {}
    hook(plugin, 'configureServer')({ middlewares: { use: (handler: Hook) => (middleware = handler) } })

    const response = { setHeader: vi.fn(), end: vi.fn() }
    const next = vi.fn()
    middleware({ url: `/${DEFAULT_THEME_SCRIPT}?t=1` }, response, next)
    middleware({ url: '/src/main.tsx' }, response, next)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/javascript')
    expect(response.end).toHaveBeenCalledOnce()
    expect(response.end).toHaveBeenCalledWith(SCRIPT)
    expect(next).toHaveBeenCalledOnce()
  })

  it('inlines no file as a data: URI (fonts under 4 kB included), unless the application says otherwise', () => {
    expect(configured(ioiti()).build).toEqual({ assetsInlineLimit: 0 })
    expect(configured(ioiti(), { build: { assetsInlineLimit: 2048 } }).build).toBeUndefined()
  })

  it('makes one React and one framer-motion, and lets the dev server read the package\'s folder', () => {
    const config = configured(ioiti(), { root: process.cwd() })

    expect(config.resolve?.dedupe).toEqual(['react', 'react-dom', 'framer-motion'])
    expect(config.server?.fs?.allow).toContain(PACKAGE)
    // With the application's own workspace, which Vite would no longer allow by itself.
    expect(config.server?.fs?.allow).toHaveLength(2)
  })
})
