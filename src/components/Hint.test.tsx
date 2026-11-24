import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Hint } from './Hint.js'

/** A while longer than the hint waits before closing once the pointer has left its trigger (120 ms). */
const pastTheGrace = () => new Promise((resolve) => setTimeout(resolve, 300))

describe('a hint', () => {
  it('describes its control for screen readers, and shows on keyboard focus', async () => {
    const user = userEvent.setup()
    render(
      <Hint content="Switch it off before deleting it">
        <button type="button">Delete</button>
      </Hint>,
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveAccessibleDescription('Switch it off before deleting it')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    await expectAccessible(document.body)

    await user.tab()
    // Drawn over the page, out of any parent that would cut it.
    expect(await screen.findByRole('tooltip', { hidden: true })).toHaveTextContent('Switch it off before deleting it')
    expect(screen.getByRole('tooltip', { hidden: true }).parentElement).toBe(document.body)
    await expectAccessible(document.body)
  })

  it('stays while the pointer goes onto it and rests there, and goes on Escape (WCAG 1.4.13)', async () => {
    const user = userEvent.setup()
    render(
      <Hint content="Switch it off before deleting it">
        <button type="button">Delete</button>
      </Hint>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })

    await user.hover(button)
    const tip = await screen.findByRole('tooltip', { hidden: true })
    // Off its trigger and onto the tooltip: it waits for the pointer, which keeps it.
    await user.hover(tip)
    await pastTheGrace()
    expect(screen.getByRole('tooltip', { hidden: true })).toBe(tip)
    // Back onto its trigger, and onto it again.
    await user.hover(button)
    await user.hover(tip)
    await pastTheGrace()
    expect(screen.getByRole('tooltip', { hidden: true })).toBe(tip)
    await expectAccessible(document.body)

    // Dismissed without moving the pointer or the focus.
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('goes once the pointer leaves it, or leaves its trigger for somewhere else', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Hint content="Switch it off before deleting it">
          <button type="button">Delete</button>
        </Hint>
        <p>Elsewhere</p>
      </>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })

    await user.hover(button)
    await user.hover(await screen.findByRole('tooltip', { hidden: true }))
    await user.hover(screen.getByText('Elsewhere'))
    await waitFor(() => expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument(), { timeout: 3000 })

    await user.hover(button)
    await screen.findByRole('tooltip', { hidden: true })
    await user.unhover(button)
    await waitFor(() => expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('stays when it is pressed, as a press elsewhere than on it or its trigger hides it', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Hint content="Switch it off before deleting it">
          <button type="button">Delete</button>
        </Hint>
        <p>Elsewhere</p>
      </>,
    )

    await user.hover(screen.getByRole('button', { name: 'Delete' }))
    const tip = await screen.findByRole('tooltip', { hidden: true })
    await user.click(tip)
    await pastTheGrace()
    expect(screen.getByRole('tooltip', { hidden: true })).toBe(tip)

    await user.click(screen.getByText('Elsewhere'))
    await waitFor(() => expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('leaves its control\'s own ref to it, read where React 19 keeps it', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const ref = createRef<HTMLButtonElement>()
    try {
      render(
        <Hint content="Switch it off before deleting it">
          <button ref={ref} type="button">
            Delete
          </button>
        </Hint>,
      )

      expect(ref.current).toBe(screen.getByRole('button', { name: 'Delete' }))
      expect(error.mock.calls.flat().join(' ')).not.toContain('element.ref')
    } finally {
      error.mockRestore()
    }
  })

  it('shows at once on a tap, and goes on Escape', async () => {
    render(
      <Hint content="The page refreshes on a timer" wrap>
        <span>Polling</span>
      </Hint>,
    )

    const wrapper = screen.getByText('Polling').parentElement as HTMLElement
    act(() => {
      fireEvent.pointerDown(wrapper, { pointerType: 'touch' })
    })
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('The page refreshes on a timer')

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    await waitFor(() => expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument(), { timeout: 3000 })
  })

  it('lets the keyboard reach a disabled control through a wrapper that carries its hint', async () => {
    const user = userEvent.setup()
    render(
      <Hint content="Two to 4 finished runs can be compared" wrap>
        <button type="button" disabled>
          Compare
        </button>
      </Hint>,
    )

    await user.tab()
    const wrapper = screen.getByRole('button', { name: 'Compare' }).parentElement as HTMLElement
    expect(wrapper).toHaveFocus()
    expect(wrapper).toHaveAccessibleDescription('Two to 4 finished runs can be compared')
  })

  it('says and shows nothing, and takes no focus, when it has nothing to say', async () => {
    const user = userEvent.setup()
    render(
      <Hint content={null} wrap>
        <button type="button" disabled>
          Saved
        </button>
      </Hint>,
    )

    const button = screen.getByRole('button', { name: 'Saved' })
    expect(button).not.toHaveAccessibleDescription()
    await user.tab()
    expect(document.body).toHaveFocus()
  })
})
