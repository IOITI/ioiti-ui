import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { Dialog } from './ui/settle-modal.js'

type ModalProps = Omit<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>

function Opener(props: ModalProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog {...props} open={open} onOpenChange={setOpen}>
        <button type="button">Keep</button>
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
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

describe('Dialog in a language', () => {
  it("names its close button in the language given, an application's own word over English's", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Opener title="Archiver le projet" />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider messages={{ dialog: { close: 'Dismiss' } }}>
        <Opener title="Archive the project" />
      </IoitiProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })
})

describe('Dialog held open', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('by itself (defaultOpen): it closes itself, and tells onOpenChange and onClose', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const closed = vi.fn()
    render(<Dialog defaultOpen title="Welcome" onOpenChange={changed} onClose={closed} />)
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(changed).toHaveBeenCalledWith(false)
    expect(closed).toHaveBeenCalledOnce()
  })

  it('by the page (open): Escape tells it, and the dialog stays until the page closes it', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    const closed = vi.fn()
    const { rerender } = render(<Dialog open title="Archive" onOpenChange={changed} onClose={closed} />)
    await user.keyboard('{Escape}')
    expect(changed).toHaveBeenCalledWith(false)
    expect(closed).toHaveBeenCalledOnce()
    expect(screen.getByRole('dialog', { name: 'Archive' })).toBeInTheDocument()

    rerender(<Dialog open={false} title="Archive" onOpenChange={changed} onClose={closed} />)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('has its close button unless showCloseButton is false', () => {
    const { rerender } = render(<Dialog open title="Archive" />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    rerender(<Dialog open title="Archive" showCloseButton={false} />)
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })
})
