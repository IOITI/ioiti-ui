import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Popover } from './Popover.js'
import { SegmentedControl } from './SegmentedControl.js'
import { Button } from './ui/button.js'
import { SettleModal } from './ui/settle-modal.js'

function Filters() {
  return (
    <Popover label="Filters" trigger={<Button>Filters</Button>}>
      {(close) => (
        <>
          <label>
            Customer <input />
          </label>
          <Button onClick={close}>Apply</Button>
        </>
      )}
    </Popover>
  )
}

describe('Popover', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens beside its button, in the page body, the focus in it', async () => {
    const user = userEvent.setup()
    render(<Filters />)

    const button = screen.getByRole('button', { name: 'Filters' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    await user.click(button)

    const dialog = screen.getByRole('dialog', { name: 'Filters' })
    expect(dialog.parentElement).toBe(document.body)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-controls', dialog.id)
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Customer' })).toHaveFocus())
  })

  it('closes on Escape and gives the focus back', async () => {
    const user = userEvent.setup()
    render(<Filters />)
    const button = screen.getByRole('button', { name: 'Filters' })
    await user.click(button)
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Customer' })).toHaveFocus())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(button).toHaveFocus()
  })

  it('closes on a Tab past its end, and on a press elsewhere', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Filters />
        <p>Elsewhere</p>
      </>,
    )
    const button = screen.getByRole('button', { name: 'Filters' })
    await user.click(button)
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Customer' })).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus()
    await user.tab()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(button).toHaveFocus()

    await user.click(button)
    await user.click(screen.getByText('Elsewhere'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('keeps Escape and Tab to itself inside a dialog', async () => {
    const user = userEvent.setup()
    function InDialog() {
      const [open, setOpen] = useState(true)
      return (
        <SettleModal open={open} onClose={() => setOpen(false)} title="Edit the order">
          <Filters />
        </SettleModal>
      )
    }
    render(<InDialog />)
    await user.click(screen.getByRole('button', { name: 'Filters' }))
    await waitFor(() => expect(screen.getByRole('textbox', { name: 'Customer' })).toHaveFocus())

    await user.tab()
    expect(screen.getByRole('button', { name: 'Apply' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Filters' })).not.toBeInTheDocument())
    expect(screen.getByRole('dialog', { name: 'Edit the order' })).toBeInTheDocument()
  })

  it('is placed again as what it holds grows, still above its button near the bottom of the window', async () => {
    const user = userEvent.setup()
    // No layout in jsdom: the button near the bottom of an 800 px window, the popover as tall as it holds.
    let tall = 40
    let resized: () => void = () => {}
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) {
        resized = callback
      }
      observe() {}
      disconnect() {}
    })
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)
    vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
      return this.getAttribute('role') === 'dialog' ? tall : 0
    })
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ top: 700, bottom: 732, left: 40, right: 140, width: 100, height: 32, x: 40, y: 700, toJSON: () => ({}) }) as DOMRect,
    )
    render(
      <Popover label="Context" side="top" trigger={<Button>Context</Button>}>
        <p>Counting…</p>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Context' }))
    const dialog = screen.getByRole('dialog', { name: 'Context' })
    expect(dialog).toHaveStyle({ top: '654px' })

    // What it waited for arrives: ten times as tall, it rises, its bottom still above the button.
    tall = 400
    act(() => resized())
    expect(dialog).toHaveStyle({ top: '294px' })
    vi.unstubAllGlobals()
  })

  it('takes what animates its layout in it along at once as the page scrolls', async () => {
    const user = userEvent.setup()
    // No layout in jsdom: its button is 120 px higher once the page has scrolled, what is in the popover
    // is where the popover is, and the segments are side by side, 100 px apart.
    let scrolled = 0
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const layer = this.closest<HTMLElement>('[role="dialog"]')
      const top = layer ? Number.parseFloat(layer.style.top) : 200 - scrolled
      const segment = this.closest('[role="radio"]')
      const left = 40 + (segment?.parentElement ? [...segment.parentElement.children].indexOf(segment) * 100 : 0)
      return { top, bottom: top + 32, left, right: left + 100, width: 100, height: 32, x: left, y: top, toJSON: () => ({}) } as DOMRect
    })
    render(
      // Its content drawn again as it moves, as a function of `close` is.
      <Popover label="Filters" trigger={<Button>Filters</Button>}>
        {() => <SegmentedControl label="Status" defaultValue="all" options={[{ value: 'all', label: 'All' }, { value: 'paid', label: 'Paid' }]} />}
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Filters' }))
    const fill = screen.getByRole('radio', { name: 'All' }).querySelector<HTMLElement>('[aria-hidden]')
    if (!fill) throw new Error('no fill under the chosen segment')
    // Arrived, as it has once the page is scrolled.
    const dialog = screen.getByRole('dialog', { name: 'Filters' })
    await waitFor(() => expect(dialog.style.transform).toMatch(/^(none)?$/))

    scrolled = 120
    act(() => {
      document.dispatchEvent(new Event('scroll'))
    })
    expect(dialog).toHaveStyle({ top: '118px' })
    // A few frames on, the fill is still under its segment: it trailed after it, moved back from where it was.
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(fill.style.transform).not.toMatch(/translate/)
    expect(dialog.style.transform).toMatch(/^(none)?$/)

    // Another segment chosen, the fill still slides to it, from the one before.
    await user.click(screen.getByRole('radio', { name: 'Paid' }))
    const moved = screen.getByRole('radio', { name: 'Paid' }).querySelector<HTMLElement>('[aria-hidden]')
    await waitFor(() => expect(moved?.style.transform).toMatch(/^translate3d\(-\d/))
    await waitFor(() => expect(moved?.style.transform).toMatch(/^(none)?$/), { timeout: 3000 })
  })
})
