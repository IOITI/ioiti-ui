import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmAction } from './ConfirmAction.js'

/** The dialog opened from a table's row: a right-aligned cell that does not wrap. */
function DeleteFromATableCell() {
  const [open, setOpen] = useState(false)
  return (
    <table>
      <tbody>
        <tr>
          <td className="whitespace-nowrap text-right">
            <button type="button" onClick={() => setOpen(true)}>
              Delete
            </button>
            <ConfirmAction
              open={open}
              title="Delete this project"
              confirmLabel="Slide to delete"
              description="The project and its files are removed."
              onConfirm={() => {}}
              onClose={() => setOpen(false)}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

describe('confirmation dialog', () => {
  it('is not inside the element that opens it, so it takes none of its layout', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const dialog = await screen.findByRole('dialog', { name: 'Delete this project' })
    expect(dialog.closest('td')).toBeNull()
    expect(dialog.parentElement).toBe(document.body)
    expect(dialog).toHaveClass('text-left')
  })

  it('takes keyboard focus when it opens, without putting it on the control that confirms', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveFocus()
    expect(screen.getByRole('slider')).not.toHaveFocus()
  })

  it('keeps Tab inside it, in both directions', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)
    const opener = screen.getByRole('button', { name: 'Delete' })
    await user.click(opener)
    const dialog = await screen.findByRole('dialog')

    const visited = new Set<Element | null>()
    for (let press = 0; press < 8; press += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
      visited.add(document.activeElement)
    }
    // The slider, Cancel and the close button, and nothing of the page behind.
    expect(visited).toContain(screen.getByRole('slider'))
    expect(visited).toContain(screen.getByRole('button', { name: 'Cancel' }))
    expect(visited).not.toContain(opener)

    await user.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('gives focus back to what opened it when it is dismissed', async () => {
    const user = userEvent.setup()
    render(<DeleteFromATableCell />)
    const opener = screen.getByRole('button', { name: 'Delete' })
    await user.click(opener)
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })
})

describe('what is at stake', () => {
  it('is said first when it is given, and not at all otherwise', () => {
    const { rerender } = render(
      <ConfirmAction open title="Delete" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )
    expect(screen.queryByText('This cannot be undone.')).not.toBeInTheDocument()

    rerender(
      <ConfirmAction
        open
        title="Delete"
        confirmLabel="Slide to delete"
        warning="This cannot be undone."
        description="…"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })
})

describe('how an action is confirmed', () => {
  it('is a slide for what cannot be taken back', () => {
    render(
      <ConfirmAction open title="Delete this project" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )

    expect(screen.getByRole('slider', { name: 'Slide to delete' })).toBeInTheDocument()
    // The component keeps a button for screen readers, out of sight: it must not be
    // a Tab stop, or Enter on a focus nobody can see would confirm the action.
    expect(screen.getByRole('button', { name: 'Slide to delete' })).toHaveAttribute('tabindex', '-1')
  })

  it('has no Tab stop that cannot be seen', async () => {
    const user = userEvent.setup()
    render(
      <ConfirmAction open title="Delete this project" confirmLabel="Slide to delete" description="…" onConfirm={() => {}} onClose={() => {}} />,
    )
    const hidden = screen.getByRole('button', { name: 'Slide to delete' })

    for (let press = 0; press < 6; press += 1) {
      await user.tab()
      expect(hidden).not.toHaveFocus()
    }
  })

  it('is one click for the protective direction', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmAction
        open
        gesture="button"
        title="Pause the imports"
        confirmLabel="Pause the imports"
        description="…"
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    )

    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pause the imports' }))

    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('does not confirm a slide on an arrow key, only on Enter or Space', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmAction open title="Send" confirmLabel="Slide to send" description="…" onConfirm={onConfirm} onClose={() => {}} />,
    )
    screen.getByRole('slider').focus()

    await user.keyboard('{ArrowRight}')
    expect(onConfirm).not.toHaveBeenCalled()

    await user.keyboard('{Enter}')
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
