import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ProductTour } from './ui/product-tour.js'
import type { TourCloseReason } from './ui/product-tour.js'

function Tour({ onClose }: { onClose?: (reason: TourCloseReason) => void }) {
  const [open, setOpen] = useState(false)
  const search = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Start the tour
      </button>
      <button ref={search} type="button">
        Search
      </button>
      <ProductTour
        open={open}
        onClose={(reason) => {
          setOpen(false)
          onClose?.(reason)
        }}
        steps={[
          { title: 'Welcome', body: 'A tour of three steps.' },
          { target: search, title: 'Search anything', body: 'Every page from one place.' },
          { title: 'That is all', body: 'Have a good day.' },
        ]}
      />
    </>
  )
}

describe('ProductTour', () => {
  it('shows each step in a dialog named by its title, the focus on Next', async () => {
    const user = userEvent.setup()
    render(<Tour />)
    await user.click(screen.getByRole('button', { name: 'Start the tour' }))

    const dialog = await screen.findByRole('dialog', { name: 'Welcome' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveTextContent('1 of 3')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus())

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('dialog', { name: 'Search anything' })).toHaveTextContent('2 of 3')
  })

  it('moves with the arrow keys, keeps Tab in its card, and closes with Escape, the focus back', async () => {
    const user = userEvent.setup()
    const closed = vi.fn()
    render(<Tour onClose={closed} />)
    const start = screen.getByRole('button', { name: 'Start the tour' })
    await user.click(start)
    await screen.findByRole('dialog', { name: 'Welcome' })

    await user.keyboard('{ArrowRight}')
    expect(await screen.findByRole('dialog', { name: 'Search anything' })).toBeInTheDocument()

    // Every stop of the card, and back to the first: never the page behind it.
    for (let stop = 0; stop < 8; stop++) {
      await user.tab()
      expect(screen.getByRole('dialog', { name: 'Search anything' })).toContainElement(document.activeElement as HTMLElement)
    }

    await user.keyboard('{Escape}')
    expect(closed).toHaveBeenCalledWith('dismiss')
    await waitFor(() => expect(start).toHaveFocus())
  })

  it('says it is done on its last step', async () => {
    const user = userEvent.setup()
    const closed = vi.fn()
    render(<Tour onClose={closed} />)
    await user.click(screen.getByRole('button', { name: 'Start the tour' }))
    await screen.findByRole('dialog', { name: 'Welcome' })
    await user.click(screen.getByRole('button', { name: 'Go to step 3' }))
    await user.click(await screen.findByRole('button', { name: 'Done' }))
    expect(closed).toHaveBeenCalledWith('done')
  })
})
