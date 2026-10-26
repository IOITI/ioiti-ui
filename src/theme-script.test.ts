import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ACCENT_ATTRIBUTE,
  ACCENTS,
  MATERIAL_ATTRIBUTE,
  MATERIALS,
  readPreference,
  resolveAccent,
  resolveMaterial,
  resolveTheme,
  THEME_KEY_ATTRIBUTE,
} from './lib/theme.js'
import { stubSystemTheme } from './test/systemTheme.js'
// The pre-paint script as the page runs it: a classic script, from its own <script src> tag.
import SOURCE from './theme.js?raw'

function runFromTag(attributes: Record<string, string> = {}) {
  const tag = document.createElement('script')
  for (const [name, value] of Object.entries(attributes)) tag.setAttribute(name, value)
  vi.spyOn(document, 'currentScript', 'get').mockReturnValue(tag)
  new Function(SOURCE)()
}

const root = document.documentElement
const isDark = () => root.classList.contains('dark')

beforeEach(() => {
  window.localStorage.clear()
  root.classList.remove('dark')
  root.removeAttribute(THEME_KEY_ATTRIBUTE)
  root.removeAttribute(ACCENT_ATTRIBUTE)
  root.removeAttribute(MATERIAL_ATTRIBUTE)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('the pre-paint theme script', () => {
  it('reads the choice under the key its tag names, and writes that key on the page', () => {
    stubSystemTheme(false)
    window.localStorage.setItem('my-app.theme', 'dark')

    runFromTag({ 'data-storage-key': 'my-app.theme' })

    expect(isDark()).toBe(true)
    expect(root.getAttribute(THEME_KEY_ATTRIBUTE)).toBe('my-app.theme')
  })

  it('uses the default key when its tag names none', () => {
    stubSystemTheme(false)
    window.localStorage.setItem('ioiti.theme', 'dark')

    runFromTag()

    expect(isDark()).toBe(true)
    expect(root.getAttribute(THEME_KEY_ATTRIBUTE)).toBe('ioiti.theme')
  })

  it('follows the system while nothing was chosen', () => {
    stubSystemTheme(true)
    runFromTag({ 'data-storage-key': 'my-app.theme' })
    expect(isDark()).toBe(true)
  })

  it('lets a chosen light theme win over a dark system', () => {
    stubSystemTheme(true)
    window.localStorage.setItem('my-app.theme', 'light')
    runFromTag({ 'data-storage-key': 'my-app.theme' })
    expect(isDark()).toBe(false)
  })

  it('leaves it to the system where the browser keeps nothing', () => {
    stubSystemTheme(true)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })
    expect(() => runFromTag()).not.toThrow()
    expect(isDark()).toBe(true)
  })

  it('shows light where the browser cannot say what the system is', () => {
    expect(() => runFromTag()).not.toThrow()
    expect(isDark()).toBe(false)
  })

  it('decides as the application will, for every choice and system setting', () => {
    for (const stored of [null, 'light', 'dark', 'sepia']) {
      for (const systemDark of [false, true]) {
        window.localStorage.clear()
        if (stored) window.localStorage.setItem('my-app.theme', stored)
        stubSystemTheme(systemDark)
        runFromTag({ 'data-storage-key': 'my-app.theme' })
        const expected = resolveTheme(readPreference('my-app.theme'), systemDark) === 'dark'
        expect(isDark(), `stored ${stored}, system ${systemDark ? 'dark' : 'light'}`).toBe(expected)
      }
    }
  })
})

describe('the accent and the material, before the first paint', () => {
  it('are the application\'s, from its tag, while nothing was chosen', () => {
    runFromTag({ 'data-storage-key': 'my-app.theme', 'data-accent': 'violet', 'data-material': 'glass' })

    expect(root.getAttribute(ACCENT_ATTRIBUTE)).toBe('violet')
    expect(root.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass')
  })

  it('are the ones chosen in this browser, neutral and flat included', () => {
    window.localStorage.setItem('my-app.theme.accent', 'neutral')
    window.localStorage.setItem('my-app.theme.material', 'flat')

    runFromTag({ 'data-storage-key': 'my-app.theme', 'data-accent': 'violet', 'data-material': 'glass' })

    expect(root.hasAttribute(ACCENT_ATTRIBUTE)).toBe(false)
    expect(root.hasAttribute(MATERIAL_ATTRIBUTE)).toBe(false)
  })

  it('write nothing where neither the application nor a person chose: the design as it was', () => {
    runFromTag()

    expect(root.hasAttribute(ACCENT_ATTRIBUTE)).toBe(false)
    expect(root.hasAttribute(MATERIAL_ATTRIBUTE)).toBe(false)
  })

  it('are the application\'s where the browser keeps nothing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })

    expect(() => runFromTag({ 'data-accent': 'indigo' })).not.toThrow()
    expect(root.getAttribute(ACCENT_ATTRIBUTE)).toBe('indigo')
  })

  it('are decided as the application will, for every choice and every default of the application', () => {
    const cases = [
      { name: 'accent', attribute: ACCENT_ATTRIBUTE, values: ACCENTS, resolve: resolveAccent },
      { name: 'material', attribute: MATERIAL_ATTRIBUTE, values: MATERIALS, resolve: resolveMaterial },
    ]
    for (const { name, attribute, values, resolve } of cases) {
      const tried = [null, ...values, 'sepia']
      for (const stored of tried) {
        for (const given of tried) {
          window.localStorage.clear()
          root.removeAttribute(attribute)
          if (stored) window.localStorage.setItem(`my-app.theme.${name}`, stored)
          runFromTag({ 'data-storage-key': 'my-app.theme', ...(given ? { [`data-${name}`]: given } : {}) })
          const expected = resolve(stored, given)
          const shown = root.getAttribute(attribute) ?? values[0]
          expect(shown, `${name}: stored ${stored}, the application's ${given}`).toBe(expected)
        }
      }
    }
  })
})
