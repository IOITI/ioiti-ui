import { createContext, useContext, useEffect, useRef } from 'react'

import { matchesStroke, parseKeys } from '../lib/keys.js'
import type { KeyStroke } from '../lib/keys.js'

// The keyboard shortcuts of an application: each registered where it means something (a page, a panel),
// heard by one listener on the window, attached while one is registered. They wait while a dialog is open
// (one dialog at a time: its keys are its own), and keys without ⌘ or Ctrl wait while text is typed.

export interface Shortcut {
  keys: string
  /** What it does, in words: listed by ShortcutsDialog. Without it, it works and is not listed. */
  description?: string
  /** The heading it is listed under: "Navigation", "Orders". */
  group?: string
  /** Heard while text is typed too (a field, an editor): keys with ⌘ or Ctrl always are. */
  allowInInputs?: boolean
  /** Its action; `null` for a shortcut listed and heard by someone else (a component's own ⌘B). */
  handler: ((event: KeyboardEvent) => void) | null
}

interface Entry extends Shortcut {
  id: number
  strokes: KeyStroke[]
}

export interface ShortcutRegistry {
  register: (shortcut: Shortcut) => () => void
  subscribe: (listener: () => void) => () => void
  /** The shortcuts registered, in the order they were. The same array until one comes or goes. */
  list: () => readonly Shortcut[]
}

/** How long a key of a sequence ("g", then "o") waits for the next. */
const SEQUENCE_WAIT = 1000

function typing(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag !== 'INPUT') return false
  const type = (target as HTMLInputElement).type
  return !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'color', 'file'].includes(type)
}

export function createShortcutRegistry(): ShortcutRegistry {
  const entries = new Map<number, Entry>()
  const listeners = new Set<() => void>()
  let next = 0
  let snapshot: readonly Shortcut[] = []
  let pressed: { stroke: KeyboardEvent; at: number }[] = []

  const changed = () => {
    snapshot = Array.from(entries.values())
    for (const listener of listeners) listener()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented || ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return
    // A dialog is open: its keys are its own.
    if (document.querySelector('[aria-modal="true"]')) return
    const now = event.timeStamp
    pressed = [...pressed.filter((each) => now - each.at < SEQUENCE_WAIT), { stroke: event, at: now }].slice(-3)
    const inText = typing(event.target)
    for (const entry of entries.values()) {
      if (!entry.handler) continue
      const held = entry.strokes.some((stroke) => stroke.mod || stroke.ctrl || stroke.meta)
      if (inText && !held && !entry.allowInInputs) continue
      const last = pressed.slice(-entry.strokes.length)
      if (last.length !== entry.strokes.length) continue
      if (!entry.strokes.every((stroke, index) => matchesStroke(last[index].stroke, stroke))) continue
      event.preventDefault()
      pressed = []
      entry.handler(event)
      return
    }
  }

  return {
    register(shortcut) {
      const id = ++next
      entries.set(id, { ...shortcut, id, strokes: parseKeys(shortcut.keys) })
      if (entries.size === 1) window.addEventListener('keydown', onKeyDown)
      changed()
      return () => {
        entries.delete(id)
        if (entries.size === 0) window.removeEventListener('keydown', onKeyDown)
        changed()
      }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    list: () => snapshot,
  }
}

// Outside IoitiProvider (a component rendered alone): one registry for the page.
export const ShortcutsContext = createContext<ShortcutRegistry>(createShortcutRegistry())

/** The registry of the application's shortcuts. */
export function useShortcutRegistry(): ShortcutRegistry {
  return useContext(ShortcutsContext)
}

interface ShortcutOptions {
  description?: string
  group?: string
  /** Off for now: neither heard nor listed. */
  enabled?: boolean
  allowInInputs?: boolean
}

/**
 * A keyboard shortcut, heard while the component that registers it is there: `mod+k` (⌘K or Ctrl K),
 * `g o` (G, then O), `?`. Given a description, ShortcutsDialog lists it. Keys without ⌘ or Ctrl are not
 * heard while text is typed, nor any while a dialog is open.
 */
export function useShortcut(keys: string, handler: ((event: KeyboardEvent) => void) | null, options: ShortcutOptions = {}) {
  const registry = useShortcutRegistry()
  const { description, group, enabled = true, allowInInputs = false } = options
  // The latest handler, without registering again at each render.
  const latest = useRef(handler)
  useEffect(() => {
    latest.current = handler
  })
  const handles = handler !== null
  useEffect(() => {
    if (!enabled) return
    return registry.register({
      keys,
      description,
      group,
      allowInInputs,
      handler: handles ? (event) => latest.current?.(event) : null,
    })
  }, [registry, keys, description, group, enabled, allowInInputs, handles])
}
