// The keys of a shortcut, written as a person reads them: `mod+k`, `shift+/`, `g o` (one key, then another).
// `mod` is the key a shortcut uses on this computer: ⌘ on Apple's, Ctrl elsewhere. Nothing here reads the
// browser when it loads: the platform is read when a key is drawn or pressed. The keys are named in the words given (a
// catalogue's `keys`, `useMessages().keys`), English's by default; Apple's symbols stay symbols, and
// `aria-keyshortcuts` names keys in ARIA's English whatever the language.

import { en } from '../locales/en.js'
import type { Messages } from '../locales/en.js'

export interface KeyStroke {
  /** The key itself, lower case: `k`, `/`, `enter`, `arrowup`. */
  key: string
  mod: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
}

const ALIASES: Record<string, string> = {
  cmd: 'meta',
  command: 'meta',
  option: 'alt',
  control: 'ctrl',
  esc: 'escape',
  return: 'enter',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
  plus: '+',
}

const MODIFIERS = new Set(['mod', 'ctrl', 'meta', 'alt', 'shift'])

/** Whether the keys are an Apple computer's (⌘ for shortcuts). */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? ''
  return /mac|iphone|ipad|ipod/i.test(platform)
}

/** `"mod+k"` as one stroke, `"g o"` as two pressed one after the other. */
export function parseKeys(keys: string): KeyStroke[] {
  return keys
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((stroke) => {
      const parts = stroke.split('+').map((part) => ALIASES[part.toLowerCase()] ?? part.toLowerCase())
      // `mod++` is mod and the plus key: the last part, empty, is the key.
      const key = parts[parts.length - 1] || '+'
      const held = new Set(parts.slice(0, -1).filter((part) => MODIFIERS.has(part)))
      return {
        key: ALIASES[key] ?? key,
        mod: held.has('mod'),
        ctrl: held.has('ctrl'),
        meta: held.has('meta'),
        alt: held.has('alt'),
        shift: held.has('shift'),
      }
    })
}

/** A key as `KeyboardEvent.key` names it, in this file's names: `space`, `escape`, `k`. */
function keyOf(key: string): string {
  const lower = key.toLowerCase()
  if (lower === ' ' || lower === 'spacebar') return 'space'
  if (lower === 'esc') return 'escape'
  return lower
}

/**
 * Whether a key pressed is this stroke. A character typed with Shift (`?`) is its own key, Shift not asked
 * of it: write the character (`?`), not the keys that type it on one keyboard (`shift+/`).
 */
export function matchesStroke(
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>,
  stroke: KeyStroke,
  apple = isApplePlatform(),
): boolean {
  if (keyOf(event.key) !== stroke.key) return false
  const ctrl = stroke.ctrl || (stroke.mod && !apple)
  const meta = stroke.meta || (stroke.mod && apple)
  const symbol = stroke.key.length === 1 && !/[a-z0-9]/.test(stroke.key)
  return (
    event.ctrlKey === ctrl &&
    event.metaKey === meta &&
    event.altKey === stroke.alt &&
    (symbol ? true : event.shiftKey === stroke.shift)
  )
}

export interface KeyLabel {
  /** What is drawn on the key: `⌘`, `Ctrl`, `K`. */
  shown: string
  /** What a screen reader says of it, when that is not what is drawn. */
  spoken?: string
}

/** The names keys are shown and said with: a catalogue's `keys` (`useMessages().keys`), English's by default. */
export type KeyWords = Messages['keys']

/** A key drawn one way and said another: said apart only where a language says it otherwise (« Échap » is both). */
const label = (shown: string, spoken?: string): KeyLabel => (spoken === undefined || spoken === shown ? { shown } : { shown, spoken })

/** The modifiers of an Apple computer: its symbols, said in words. */
const appleModifiers = (words: KeyWords): Record<string, KeyLabel> => ({
  mod: label('⌘', words.command),
  meta: label('⌘', words.command),
  ctrl: label('⌃', words.control),
  alt: label('⌥', words.option),
  shift: label('⇧', words.shift),
})

/** The modifiers of another computer, named on their key caps. */
const otherModifiers = (words: KeyWords): Record<string, KeyLabel> => ({
  mod: label(words.ctrl),
  meta: label(words.meta),
  ctrl: label(words.ctrl),
  alt: label(words.alt),
  shift: label(words.shift),
})

/** The keys with a name (not a character): drawn as a symbol or a short name, said in full where that differs. */
const named = (words: KeyWords): Record<string, KeyLabel> => ({
  enter: label('↵', words.enter),
  escape: label(words.escape, words.escapeSpoken),
  tab: label(words.tab),
  space: label(words.space),
  backspace: label('⌫', words.backspace),
  delete: label(words.delete, words.deleteSpoken),
  arrowup: label('↑', words.arrowUp),
  arrowdown: label('↓', words.arrowDown),
  arrowleft: label('←', words.arrowLeft),
  arrowright: label('→', words.arrowRight),
  pageup: label(words.pageUp, words.pageUpSpoken),
  pagedown: label(words.pageDown, words.pageDownSpoken),
  home: label(words.home),
  end: label(words.end),
})

/**
 * The keys of each stroke, as drawn here: modifiers first, in the order this computer writes them, named in the words
 * given (English's by default).
 */
export function keyLabels(keys: string, apple = isApplePlatform(), words: KeyWords = en.keys): KeyLabel[][] {
  const modifiers = apple ? appleModifiers(words) : otherModifiers(words)
  const names = named(words)
  // Apple's order is ⌃⌥⇧⌘; elsewhere Ctrl, Alt, Shift.
  const order: (keyof KeyStroke)[] = apple ? ['ctrl', 'alt', 'shift', 'meta', 'mod'] : ['mod', 'ctrl', 'meta', 'alt', 'shift']
  return parseKeys(keys).map((stroke) => {
    const held = order.filter((name) => stroke[name] === true).map((name) => modifiers[name as string])
    const key = names[stroke.key] ?? { shown: stroke.key.length === 1 ? stroke.key.toUpperCase() : stroke.key }
    return [...held, key]
  })
}

/** The keys in words, for a screen reader or a sentence: "Command K", "G then O" (« Commande K », « G puis O »). */
export function describeKeys(keys: string, apple = isApplePlatform(), words: KeyWords = en.keys): string {
  return keyLabels(keys, apple, words)
    .map((stroke) => stroke.map((label) => label.spoken ?? label.shown).join(' '))
    .join(` ${words.then} `)
}

/**
 * The keys as words drawn where no key cap fits (a tooltip): "⌘B" on an Apple computer, "Ctrl B" elsewhere, "G then O"
 * for a sequence.
 */
export function keysText(keys: string, apple = isApplePlatform(), words: KeyWords = en.keys): string {
  return keyLabels(keys, apple, words)
    .map((stroke) => stroke.map((label) => label.shown).join(apple ? '' : ' '))
    .join(` ${words.then} `)
}

/** A key in words: the name on its key cap ("Esc", "Del"), or what is said of it where the cap shows a symbol (↵, ⇧). */
const inWords = (label: KeyLabel) => (label.spoken !== undefined && !/\p{L}/u.test(label.shown) ? label.spoken : label.shown)

/**
 * The keys named in a hint's words, each stroke's joined by "+": "Shift+Enter" (« Maj+Entrée » in French), "Ctrl+Del"
 * (« Ctrl+Suppr »), "Command+K" on an Apple computer, "G then O". Named, never drawn: Enter, not ↵.
 */
export function keysInWords(keys: string, apple = isApplePlatform(), words: KeyWords = en.keys): string {
  return keyLabels(keys, apple, words)
    .map((stroke) => stroke.map(inWords).join('+'))
    .join(` ${words.then} `)
}

// i18n-exempt: the names `aria-keyshortcuts` takes, KeyboardEvent's, the same in every language.
const ARIA_NAMES: Record<string, string> = {
  arrowup: 'ArrowUp',
  arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowright: 'ArrowRight',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  space: 'Space',
}

/**
 * The keys as `aria-keyshortcuts` names them: "Meta+B" on an Apple computer, "Control+B" elsewhere. A sequence ("g o")
 * has no such name: `undefined`.
 */
export function ariaKeyShortcuts(keys: string, apple = isApplePlatform()): string | undefined {
  const strokes = parseKeys(keys)
  if (strokes.length !== 1) return undefined
  const [stroke] = strokes
  // i18n-exempt: the modifiers as `aria-keyshortcuts` names them, the same in every language.
  const held = [
    (stroke.ctrl || (stroke.mod && !apple)) && 'Control',
    stroke.alt && 'Alt',
    stroke.shift && 'Shift',
    (stroke.meta || (stroke.mod && apple)) && 'Meta',
  ].filter((name): name is string => typeof name === 'string')
  const key =
    ARIA_NAMES[stroke.key] ??
    (stroke.key.length === 1 ? stroke.key.toUpperCase() : stroke.key[0].toUpperCase() + stroke.key.slice(1))
  return [...held, key].join('+')
}
