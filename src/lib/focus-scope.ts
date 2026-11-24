// What keeps the focus in a layer that holds the page (a dialog, the sidebar's drawer on a phone): moved into it as it
// opens, kept in it by Tab and Shift+Tab, given back to what had it once it closes. One scope keeps it at a time, the
// last one opened: a dialog opened from the drawer keeps it until it closes, then the drawer again.
//
// What floats beside a control in it (a menu, a list of options) is drawn in document.body, outside the scope, and keeps
// its own keys (useAnchoredLayer, anchor.ts): the scope listens on the document as a key bubbles up, after them, and
// leaves a key they took (`defaultPrevented`) alone.
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import { focusables } from './anchor.js'

export interface FocusScopeOptions {
  /** Whether the layer is open: the focus goes in as it turns true, back as it turns false or the layer goes. */
  active: boolean
  /** What takes the focus first: what the function finds, else the first control of the layer, else the layer itself. */
  initialFocus?: () => HTMLElement | null | undefined
  /** The focus given back to what had it before (true by default), unless it was moved elsewhere meanwhile. */
  restoreFocus?: boolean
  /** Escape, pressed while this scope keeps the focus and nothing inside took it. */
  onEscape?: (event: KeyboardEvent) => void
}

const scopes: HTMLElement[] = []

/** The layer that keeps the focus now (the latest one opened), if one does: what is said goes in it (announce.ts). */
export function currentFocusScope(): HTMLElement | null {
  return scopes.at(-1) ?? null
}

/** Keeps the focus in `ref`'s element while `active` (see the top of this file). */
export function useFocusScope(ref: RefObject<HTMLElement | null>, { active, initialFocus, restoreFocus = true, onEscape }: FocusScopeOptions): void {
  const latest = useRef({ initialFocus, onEscape, restoreFocus })
  useEffect(() => {
    latest.current = { initialFocus, onEscape, restoreFocus }
  })

  useEffect(() => {
    const layer = ref.current
    if (!active || !layer) return
    const had = document.activeElement
    const opener = had instanceof HTMLElement && had !== document.body && !layer.contains(had) ? had : null
    scopes.push(layer)

    // In: unless it is there already (a field given autoFocus).
    if (!layer.contains(document.activeElement)) {
      const first = latest.current.initialFocus?.() ?? focusables(layer)[0] ?? layer
      if (first === layer && !layer.hasAttribute('tabindex')) layer.tabIndex = -1
      first.focus({ preventScroll: true })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (scopes.at(-1) !== layer || event.defaultPrevented) return
      if (event.key === 'Escape') {
        latest.current.onEscape?.(event)
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables(layer)
      const current = document.activeElement
      if (!items.length) {
        event.preventDefault()
        layer.focus({ preventScroll: true })
        return
      }
      const [first, last] = [items[0], items[items.length - 1]]
      const outside = !(current instanceof Node) || !layer.contains(current)
      if (event.shiftKey && (outside || current === first || current === layer)) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const at = scopes.lastIndexOf(layer)
      if (at >= 0) scopes.splice(at, 1)
      // Back to what had it: unless the focus has gone somewhere of its own (a press elsewhere, a link followed).
      const now = document.activeElement
      const lost = !now || now === document.body || layer.contains(now)
      if (latest.current.restoreFocus && lost && opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [active, ref])
}
