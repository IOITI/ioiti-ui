import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { SettleModal } from './ui/settle-modal.js'

type ModalProps = Omit<ComponentProps<typeof SettleModal>, 'open' | 'onClose'>

function Opener(props: ModalProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <SettleModal {...props} open={open} onClose={() => setOpen(false)}>
        <button type="button">Keep</button>
      </SettleModal>
    </>
  )
}

describe('SettleModal', () => {
  it('is named by its title, keeps the focus, and gives it back on Escape', async () => {
    const user = userEvent.setup()
    render(<Opener title="Archive the project" description="It can be restored for 30 days." />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog', { name: 'Archive the project' })
    expect(dialog).toHaveAccessibleDescription('It can be restored for 30 days.')
    expect(dialog).toHaveFocus()
    await expectAccessible(document.body)
    await user.tab()
    await user.tab()
    await user.tab()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('is named by aria-label without a title, and says it to its developer when it has no name at all', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const user = userEvent.setup()
    const { unmount } = render(<Opener aria-label="Pick a colour" />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Pick a colour' })).toBeInTheDocument()
    expect(warn).not.toHaveBeenCalled()
    unmount()

    render(<Opener />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toMatch(/^ioiti-ui: a dialog has neither a title nor an aria-label/)
    warn.mockRestore()
  })
})
