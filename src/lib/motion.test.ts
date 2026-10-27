import { afterEach, describe, expect, it, vi } from 'vitest'

import { changeLook, LOOK_CHANGE_ATTRIBUTE, LOOK_CHANGE_WAIT } from './motion.js'

const html = document.documentElement

interface Started {
  finished: Promise<void>
  skipTransition: () => void
}

/** The browser's view transitions, as a test makes them: when the update is called, how one ends. */
function browserStarts(start: (update: () => void) => Started) {
  Object.defineProperty(document, 'startViewTransition', { configurable: true, writable: true, value: vi.fn(start) })
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

  it('is made all the same when a transition ends without calling it', async () => {
    browserStarts(() => ({ finished: Promise.resolve(), skipTransition: () => {} }))
    const update = vi.fn()
    changeLook(update)

    await settle()
    expect(update).toHaveBeenCalledOnce()
    expect(html.hasAttribute(LOOK_CHANGE_ATTRIBUTE)).toBe(false)
  })
})
