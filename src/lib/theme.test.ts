import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { stubSystemTheme } from '../test/systemTheme.js'

import {
  ACCENT_ATTRIBUTE,
  ACCENTS,
  applyAccent,
  applyMaterial,
  applyTheme,
  lookLabel,
  MATERIAL_ATTRIBUTE,
  MATERIALS,
  nextPreference,
  readAccent,
  readMaterial,
  readPreference,
  resolveAccent,
  resolveMaterial,
  resolveTheme,
  DEFAULT_THEME_STORAGE_KEY,
  shownAccent,
  shownMaterial,
  systemIsDark,
  THEME_KEY_ATTRIBUTE,
  themeLabel,
  themeStorageKey,
  watchSystem,
  writeAccent,
  writeMaterial,
  writePreference,
} from './theme.js'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute(THEME_KEY_ATTRIBUTE)
  document.documentElement.removeAttribute(ACCENT_ATTRIBUTE)
  document.documentElement.removeAttribute(MATERIAL_ATTRIBUTE)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('the theme chosen', () => {
  it('is to follow the system until one is picked', () => {
    expect(readPreference()).toBe('system')
  })

  it('is read back from this browser', () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'light')
    expect(readPreference()).toBe('light')
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'dark')
    expect(readPreference()).toBe('dark')
  })

  it('is the system again for anything else found there', () => {
    window.localStorage.setItem(DEFAULT_THEME_STORAGE_KEY, 'sepia')
    expect(readPreference()).toBe('system')
  })

  it('is kept when it is a theme, and forgotten when it is to follow the system', () => {
    writePreference('dark')
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBe('dark')

    writePreference('system')
    expect(window.localStorage.getItem(DEFAULT_THEME_STORAGE_KEY)).toBeNull()
  })

  it('does not break where the browser keeps nothing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })

    expect(readPreference()).toBe('system')
    expect(() => writePreference('light')).not.toThrow()
  })
})

describe('the key it is kept under', () => {
  it('is the application\'s own, so that two applications on one site keep their own choice', () => {
    writePreference('dark', 'first-app.theme')
    writePreference('light', 'second-app.theme')

    expect(readPreference('first-app.theme')).toBe('dark')
    expect(readPreference('second-app.theme')).toBe('light')
    expect(readPreference()).toBe('system')
  })

  it('is the one given, else the one the pre-paint script wrote on the page, else the default', () => {
    expect(themeStorageKey()).toBe(DEFAULT_THEME_STORAGE_KEY)

    document.documentElement.setAttribute(THEME_KEY_ATTRIBUTE, 'from-the-tag.theme')
    expect(themeStorageKey()).toBe('from-the-tag.theme')

    expect(themeStorageKey('given.theme')).toBe('given.theme')
  })
})

describe('what is shown', () => {
  it('is the system\'s theme while following it, and the chosen one otherwise', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('is marked on the page by the class every dark style hangs on', () => {
    const root = document.createElement('html')

    applyTheme('dark', root)
    expect(root.classList.contains('dark')).toBe(true)

    applyTheme('light', root)
    expect(root.classList.contains('dark')).toBe(false)
  })
})

describe('the button', () => {
  it('goes from the system to light, to dark, and back to the system', () => {
    expect(nextPreference('system')).toBe('light')
    expect(nextPreference('light')).toBe('dark')
    expect(nextPreference('dark')).toBe('system')
  })

  it('says where things stand and what a press does', () => {
    expect(themeLabel('system', 'dark')).toBe('Theme: follows the system (dark now). Press for always light.')
    expect(themeLabel('system', 'light')).toBe('Theme: follows the system (light now). Press for always light.')
    expect(themeLabel('light', 'light')).toBe('Theme: always light. Press for always dark.')
    expect(themeLabel('dark', 'dark')).toBe('Theme: always dark. Press to follow the system.')
  })
})

describe('the accent and the material', () => {
  it('start as the design was: neutral, flat, the first of each list', () => {
    expect(ACCENTS[0]).toBe('neutral')
    expect(MATERIALS[0]).toBe('flat')
    expect(readAccent()).toBeNull()
    expect(readMaterial()).toBeNull()
  })

  it('are kept beside the theme, under the same key', () => {
    writeAccent('violet', 'my-app.theme')
    writeMaterial('glass', 'my-app.theme')

    expect(window.localStorage.getItem('my-app.theme.accent')).toBe('violet')
    expect(window.localStorage.getItem('my-app.theme.material')).toBe('glass')
    expect(readAccent('my-app.theme')).toBe('violet')
    expect(readMaterial('my-app.theme')).toBe('glass')
    expect(readAccent()).toBeNull()
  })

  it('read nothing from what is no accent or material', () => {
    window.localStorage.setItem(`${DEFAULT_THEME_STORAGE_KEY}.accent`, 'sepia')
    window.localStorage.setItem(`${DEFAULT_THEME_STORAGE_KEY}.material`, 'paper')
    expect(readAccent()).toBeNull()
    expect(readMaterial()).toBeNull()
  })

  it('do not break where the browser keeps nothing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage is blocked')
    })

    expect(readAccent()).toBeNull()
    expect(() => writeMaterial('glass')).not.toThrow()
  })

  it('are the one chosen, else the application\'s, else the design as it was', () => {
    expect(resolveAccent('indigo', 'violet')).toBe('indigo')
    expect(resolveAccent(null, 'violet')).toBe('violet')
    expect(resolveAccent('neutral', 'violet')).toBe('neutral')
    expect(resolveAccent('sepia', 'blue')).toBe('blue')
    expect(resolveAccent(null, 'sepia')).toBe('neutral')
    expect(resolveMaterial(null, 'glass')).toBe('glass')
    expect(resolveMaterial('flat', 'glass')).toBe('flat')
    expect(resolveMaterial('paper', null)).toBe('flat')
  })

  it('are written on <html>, and the design as it was writes nothing', () => {
    const root = document.createElement('html')

    applyAccent('violet', root)
    applyMaterial('glass', root)
    expect(root.getAttribute(ACCENT_ATTRIBUTE)).toBe('violet')
    expect(root.getAttribute(MATERIAL_ATTRIBUTE)).toBe('glass')
    expect(shownAccent(root)).toBe('violet')
    expect(shownMaterial(root)).toBe('glass')

    applyAccent('neutral', root)
    applyMaterial('flat', root)
    expect(root.hasAttribute(ACCENT_ATTRIBUTE)).toBe(false)
    expect(root.hasAttribute(MATERIAL_ATTRIBUTE)).toBe(false)
    expect(shownAccent(root)).toBe('neutral')
    expect(shownMaterial(root)).toBe('flat')
  })

  it('are said by the picker\'s button', () => {
    expect(lookLabel('neutral', 'flat')).toBe('Accent and material: neutral, flat')
    expect(lookLabel('violet', 'glass')).toBe('Accent and material: violet, glass')
  })
})

describe('the system setting', () => {
  it('is read from the browser', () => {
    stubSystemTheme(true)
    expect(systemIsDark()).toBe(true)

    stubSystemTheme(false)
    expect(systemIsDark()).toBe(false)
  })

  it('is watched, and no longer once that is stopped', () => {
    const system = stubSystemTheme(false)
    const onChange = vi.fn()

    const stop = watchSystem(onChange)
    system.set(true)
    expect(onChange).toHaveBeenCalledTimes(1)

    stop()
    system.set(false)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(system.listening()).toBe(0)
  })

  it('is taken for light where the browser cannot say', () => {
    // jsdom, and browsers older than the setting itself.
    expect(systemIsDark()).toBe(false)
    expect(() => watchSystem(() => {})()).not.toThrow()
  })
})
