import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { readPreference, resolveTheme, THEME_KEY_ATTRIBUTE } from './lib/theme.js'
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
