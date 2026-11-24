import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { UndoToast } from './ui/undo-toast.js'

/** What is left of its time, as its bar shows it: a width, in %. */
function left(): number {
  const bar = screen.getByRole('status').querySelector<HTMLElement>('.bottom-0 > div')
  return Number.parseFloat(bar?.style.width ?? 'NaN')
}

/** Its clock (animation frames, reading the time) runs for `ms`. */
async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

// framer-motion draws on the window's own frames, taken before the clock was faked: a toast leaves in real time.
const realTimeout = globalThis.setTimeout

// Events fired, not a user's (user-event waits on a timer only Jest's fake clock lets go of).
describe('UndoToast', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs on under the pointer, and stops while the keyboard is in it', async () => {
    render(<UndoToast title="2 files removed" duration={8000} />)
    await advance(2000)
    expect(left()).toBeCloseTo(75, 0)

    fireEvent.mouseEnter(screen.getByRole('status'))
    await advance(2000)
    expect(left()).toBeCloseTo(50, 0)

    // The time to reach Undo for who cannot see the bar or point at it.
    fireEvent.mouseLeave(screen.getByRole('status'))
    const undo = screen.getByRole('button', { name: 'Undo' })
    act(() => undo.focus())
    await advance(2000)
    expect(left()).toBeCloseTo(50, 0)

    act(() => undo.blur())
    await advance(2000)
    expect(left()).toBeCloseTo(25, 0)
  })

  it('draws its bar at each frame, with no transition', async () => {
    render(<UndoToast title="2 files removed" duration={8000} />)
    await advance(1000)
    // jsdom runs no transition: a browser started one again at each frame, which never left its start, and the
    // bar stood full while its width went down.
    const bar = screen.getByRole('status').querySelector<HTMLElement>('.bottom-0 > div')
    expect(bar?.style.width).toBe(`${left()}%`)
    expect(bar?.style.transition).toBe('')
    expect(bar?.className).not.toMatch(/\btransition/)
  })

  it('counts down afresh each time it opens, whatever stopped it the last time', async () => {
    const toast = (open: boolean) => <UndoToast open={open} title="2 files removed" duration={8000} />
    const { rerender } = render(toast(true))
    // Its Close pressed with the mouse takes the focus, which stops the time, and goes with the toast: no blur.
    act(() => screen.getByRole('button', { name: 'Close notification' }).focus())
    rerender(toast(false))
    await act(async () => {
      await new Promise((resolve) => realTimeout(resolve, 400))
    })
    // Gone, its frame left empty: the live region it is said in, there for the next time.
    expect(screen.queryByText('2 files removed')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    rerender(toast(true))
    await advance(2000)
    expect(left()).toBeCloseTo(75, 0)
  })

  it('is said in its frame, a live region there before its words; what went wrong at once', async () => {
    const toast = (open: boolean, variant?: 'error') => <UndoToast open={open} variant={variant} title="2 files removed" duration={8000} />
    const { rerender } = render(toast(false))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    rerender(toast(true))
    await advance(0)
    expect(screen.getByRole('status')).toHaveTextContent('2 files removed')
    rerender(toast(true, 'error'))
    expect(screen.getByRole('alert')).toHaveTextContent('2 files removed')
  })
})

describe('UndoToast without a title, and in a language', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('says "Done" without a title, which names nothing done, and says so to its developer once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { rerender } = render(<UndoToast />)
    expect(screen.getByRole('status')).toHaveTextContent('Done')
    expect(screen.getByRole('status')).toHaveTextContent('Changes will be permanent in a few seconds')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/^ioiti-ui: an UndoToast has no title/)

    rerender(<UndoToast open={false} />)
    rerender(<UndoToast />)
    rerender(<UndoToast title="2 files removed" />)
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('says its words in the language given', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <UndoToast onUndo={() => {}} />
      </IoitiProvider>,
    )
    const toast = screen.getByRole('status')
    expect(toast).toHaveTextContent('Action effectuée')
    expect(toast).toHaveTextContent('Les modifications seront définitives dans quelques secondes')
    expect(screen.getByRole('button', { name: 'Fermer la notification' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(toast).toHaveTextContent('Restauration réussie')
  })

  it("takes an application's own words over English's, and its props over both", () => {
    render(
      <IoitiProvider messages={{ toast: { undo: 'Bring them back' } }}>
        <UndoToast title="2 files removed" restoredMessage="Both are back" />
      </IoitiProvider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('2 files removed')
    fireEvent.click(screen.getByRole('button', { name: 'Bring them back' }))
    expect(screen.getByRole('status')).toHaveTextContent('Both are back')
    expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument()
  })
})
