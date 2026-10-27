/**
 * Light or dark. By default the interface follows the system setting, and keeps
 * following it when it changes; a choice made with the button overrides that
 * and is kept in this browser (a matter of screen and room, not of user).
 *
 * `src/theme.js` applies the same rules before the application starts.
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

/**
 * The accent: the colour of what is chosen, current or primary. `neutral` is the design as it was
 * (ink); the others are presets, checked for contrast in both themes (src/styles/accents.css).
 * `bloom` is a flyer's grainy gradient: its orchid, the gradient on a filled button and the
 * application's mark, and under glass the flyer as the backdrop.
 *
 * The material: `flat`, the surfaces as they were, or `glass`, translucent over a colour backdrop
 * (src/styles/glass.css).
 *
 * Both work with light and dark. The application gives its own (`ioiti({ accent, material })`,
 * written on <html> before the first paint); a person's choice (LookPicker) wins over it and is
 * kept beside the theme's, under the same key. The first of each list writes nothing on <html>.
 */
export const ACCENTS = ['neutral', 'violet', 'indigo', 'blue', 'bloom'] as const
export type Accent = (typeof ACCENTS)[number]
export const MATERIALS = ['flat', 'glass'] as const
export type Material = (typeof MATERIALS)[number]

/** On <html> while an accent other than neutral is shown: what the `accent:` styles hang on. */
export const ACCENT_ATTRIBUTE = 'data-accent'
/** On <html> while the material is glass: what the `glass-*` styles hang on. */
export const MATERIAL_ATTRIBUTE = 'data-material'

function isOneOf<T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && (values as readonly string[]).includes(value)
}

function readKept(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function keep(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // A private window, storage refused: the choice holds until the page is closed.
  }
}

/** The accent chosen in this browser, or null: none was, or what is kept is no accent. */
export function readAccent(key: string = DEFAULT_THEME_STORAGE_KEY): Accent | null {
  const kept = readKept(`${key}.accent`)
  return isOneOf(ACCENTS, kept) ? kept : null
}

export function writeAccent(accent: Accent, key: string = DEFAULT_THEME_STORAGE_KEY): void {
  keep(`${key}.accent`, accent)
}

/** The material chosen in this browser, or null. */
export function readMaterial(key: string = DEFAULT_THEME_STORAGE_KEY): Material | null {
  const kept = readKept(`${key}.material`)
  return isOneOf(MATERIALS, kept) ? kept : null
}

export function writeMaterial(material: Material, key: string = DEFAULT_THEME_STORAGE_KEY): void {
  keep(`${key}.material`, material)
}

/** What is shown: the accent chosen, else the application's, else neutral. Anything else is passed over. */
export function resolveAccent(chosen: string | null, given: string | null): Accent {
  if (isOneOf(ACCENTS, chosen)) return chosen
  return isOneOf(ACCENTS, given) ? given : 'neutral'
}

/** What is shown: the material chosen, else the application's, else flat. */
export function resolveMaterial(chosen: string | null, given: string | null): Material {
  if (isOneOf(MATERIALS, chosen)) return chosen
  return isOneOf(MATERIALS, given) ? given : 'flat'
}

/** The accent the page shows now: what the pre-paint script wrote on <html>, neutral where it wrote none. */
export function shownAccent(root: HTMLElement = document.documentElement): Accent {
  return resolveAccent(null, root.getAttribute(ACCENT_ATTRIBUTE))
}

/** The material the page shows now, as the pre-paint script wrote it. */
export function shownMaterial(root: HTMLElement = document.documentElement): Material {
  return resolveMaterial(null, root.getAttribute(MATERIAL_ATTRIBUTE))
}

/** Neutral writes nothing: the page is then the design as it was. */
export function applyAccent(accent: Accent, root: HTMLElement = document.documentElement): void {
  if (accent === 'neutral') root.removeAttribute(ACCENT_ATTRIBUTE)
  else root.setAttribute(ACCENT_ATTRIBUTE, accent)
}

/** Flat writes nothing. */
export function applyMaterial(material: Material, root: HTMLElement = document.documentElement): void {
  if (material === 'flat') root.removeAttribute(MATERIAL_ATTRIBUTE)
  else root.setAttribute(MATERIAL_ATTRIBUTE, material)
}

export const ACCENT_LABEL: Record<Accent, string> = { neutral: 'Neutral', violet: 'Violet', indigo: 'Indigo', blue: 'Blue', bloom: 'Bloom' }
export const MATERIAL_LABEL: Record<Material, string> = { flat: 'Flat', glass: 'Glass' }

/** What the picker's button says: what it is for, and what is shown ("Accent and material: violet, glass"). */
export function lookLabel(accent: Accent, material: Material): string {
  return `Accent and material: ${ACCENT_LABEL[accent].toLowerCase()}, ${MATERIAL_LABEL[material].toLowerCase()}`
}
