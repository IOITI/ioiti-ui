/**
 * Light or dark. By default the interface follows the system setting, and keeps
 * following it when it changes; a choice made with the button overrides that
 * and is kept in this browser (a matter of screen and room, not of user).
 *
 * `src/theme.js` applies the same rule before the application starts.
 */

export type Theme = 'light' | 'dark'
export type ThemePreference = 'system' | Theme

/** Where the choice is kept when the application names no key of its own. One key per application. */
export const DEFAULT_THEME_STORAGE_KEY = 'ioiti.theme'
/** Written on <html> by the pre-paint script: the key its tag was given (`data-storage-key`). */
export const THEME_KEY_ATTRIBUTE = 'data-theme-storage-key'
const SYSTEM_DARK = '(prefers-color-scheme: dark)'

/** The key the choice is kept under: the one given, else the pre-paint script's, else the default. */
export function themeStorageKey(given?: string): string {
  if (given) return given
  const written = typeof document === 'undefined' ? null : document.documentElement.getAttribute(THEME_KEY_ATTRIBUTE)
  return written || DEFAULT_THEME_STORAGE_KEY
}

export function readPreference(key: string = DEFAULT_THEME_STORAGE_KEY): ThemePreference {
  try {
    const stored = window.localStorage.getItem(key)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function writePreference(preference: ThemePreference, key: string = DEFAULT_THEME_STORAGE_KEY): void {
  try {
    if (preference === 'system') window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, preference)
  } catch {
    // A private window, storage refused: the choice holds until the page is closed.
  }
}

export function resolveTheme(preference: ThemePreference, systemIsDark: boolean): Theme {
  if (preference === 'system') return systemIsDark ? 'dark' : 'light'
  return preference
}

/** What the button goes to next: the system's choice, then light, then dark. */
export function nextPreference(preference: ThemePreference): ThemePreference {
  if (preference === 'system') return 'light'
  return preference === 'light' ? 'dark' : 'system'
}

const STATES: Record<ThemePreference, string> = { system: 'follows the system', light: 'always light', dark: 'always dark' }
const PRESSES: Record<ThemePreference, string> = {
  system: 'Press to follow the system',
  light: 'Press for always light',
  dark: 'Press for always dark',
}

/**
 * What the button says: where things stand, and what a press does. "Always"
 * tells a chosen theme from the same one arrived at by following the system.
 */
export function themeLabel(preference: ThemePreference, theme: Theme): string {
  const now = preference === 'system' ? `${STATES.system} (${theme} now)` : STATES[preference]
  return `Theme: ${now}. ${PRESSES[nextPreference(preference)]}.`
}

export function systemIsDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(SYSTEM_DARK).matches
}

/** Calls `onChange` when the system goes from light to dark or back. Returns what stops it. */
export function watchSystem(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(SYSTEM_DARK)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** The class every `dark:` style hangs on. Native controls and scrollbars follow through `color-scheme` (design.css). */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle('dark', theme === 'dark')
}
