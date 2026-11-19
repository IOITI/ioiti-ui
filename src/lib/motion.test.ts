import { afterEach, describe, expect, it, vi } from 'vitest'

import { changeLook, LOOK_CHANGE_ATTRIBUTE, LOOK_CHANGE_WAIT } from './motion.js'

const html = document.documentElement

interface Started {
  /** Settled once its animation starts; rejected when it is skipped first. Resolved unless a test says otherwise. */
  ready?: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

/** The browser's view transitions, as a test makes them: when the update is called, how one ends. */
function browserStarts(start: (update: () => void) => Started) {
  const browser = (update: () => void) => ({ ready: Promise.resolve(), ...start(update) })
  Object.defineProperty(document, 'startViewTransition', { configurable: true, writable: true, value: vi.fn(browser) })
}

/** The promises already settled have their callbacks run. */
async function settle() {
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  delete (document as { startViewTransition?: unknown }).startViewTransition
  html.removeAttribute(LOOK_CHANGE_ATTRIBUTE)
  vi.useRealTimers()
})

describe('a change of look', () => {
  it('is made at once where the browser has no view transitions, nothing written on the page', () => {
    const update = vi.fn()
    changeLook(update)

    expect(update).toHaveBeenCalledOnce()
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)
  })

  it('is drawn inside the transition, once, the page\'s own transitions held still until it ends', async () => {
    let end = () => {}
    browserStarts((update) => {
      // At its next frame.
      queueMicrotask(update)
      return { finished: new Promise<void>((resolve) => (end = resolve)), skipTransition: () => {} }
    })
    const update = vi.fn()
    changeLook(update)

    await settle()
    expect(update).toHaveBeenCalledOnce()
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(true)

    end()
    await settle()
    expect(update).toHaveBeenCalledOnce()
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)
  })

  it('is drawn without its fade where the browser draws no frame soon', () => {
    vi.useFakeTimers()
    let end = () => {}
    browserStarts((update) => ({
      finished: new Promise<void>((resolve) => (end = resolve)),
      // Skipped, a transition still calls its update.
      skipTransition: () => {
        update()
        end()
      },
    }))
    const update = vi.fn()
    changeLook(update)
    expect(update).not.toHaveBeenCalled()

    vi.advanceTimersByTime(LOOK_CHANGE_WAIT)
    expect(update).toHaveBeenCalledOnce()
  })

  it('reads the rejection of a transition skipped before its first frame: nothing is left uncaught', async () => {
    vi.useFakeTimers()
    const uncaught: unknown[] = []
    const listen = (reason: unknown) => uncaught.push(reason)
    process.on('unhandledRejection', listen)
    try {
      let end = () => {}
      let refuse: (reason: unknown) => void = () => {}
      browserStarts((update) => ({
        // As a browser's: never ready, refused once skipped.
        ready: new Promise<void>((_, reject) => (refuse = reject)),
        finished: new Promise<void>((resolve) => (end = resolve)),
        skipTransition: () => {
          refuse(new DOMException('Transition was skipped', 'AbortError'))
          update()
          end()
        },
      }))
      const update = vi.fn()
      changeLook(update)
      vi.advanceTimersByTime(LOOK_CHANGE_WAIT)
      expect(update).toHaveBeenCalledOnce()
      vi.useRealTimers()
      // Node says a rejection uncaught once the microtasks are done, and a turn of the loop after.
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(uncaught).toEqual([])
    } finally {
      process.off('unhandledRejection', listen)
    }
  })

  it('is made all the same when a transition ends without calling it', async () => {
    browserStarts(() => ({ finished: Promise.resolve(), skipTransition: () => {} }))
    const update = vi.fn()
    changeLook(update)

    await settle()
    expect(update).toHaveBeenCalledOnce()
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)
  })
})
