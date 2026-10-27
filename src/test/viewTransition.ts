import { vi } from 'vitest'

type Update = (() => void) | { update?: () => void }

/**
 * A stand-in for the browser's view transitions in tests: jsdom has none, and pages and looks then
 * change at once. The update runs at once, as a browser runs it before it animates; `finish` ends
 * the last transition started, as its animation would. Not for a page drawn with React's
 * ViewTransition in a React transition: React animates its pictures, which jsdom cannot.
 */
export function stubViewTransitions() {
  let finishLast = () => {}
  const start = vi.fn((update: Update) => {
    ;(typeof update === 'function' ? update : update.update)?.()
    const finished = new Promise<void>((resolve) => {
      finishLast = resolve
    })
    return { ready: Promise.resolve(), updateCallbackDone: Promise.resolve(), finished, skipTransition: () => finishLast() }
  })
  Object.defineProperty(document, 'startViewTransition', { configurable: true, writable: true, value: start })
  return {
    start,
    /** The last transition's animation ends. */
    finish: () => finishLast(),
    /** jsdom again, without view transitions. */
    restore: () => {
      delete (document as { startViewTransition?: unknown }).startViewTransition
    },
  }
}
