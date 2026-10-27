import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Popover } from './Popover.js'
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
})
