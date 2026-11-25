import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { IoitiProvider } from './IoitiProvider.js'
import { ShortcutsDialog } from './ShortcutsDialog.js'
import { useShortcut } from './shortcuts-context.js'
import { Dialog } from './ui/settle-modal.js'

function Page({ go, search }: { go: () => void; search: () => void }) {
  useShortcut('g o', go, { description: 'Go to the orders', group: 'Navigation' })
  useShortcut('mod+k', search, { description: 'Search' })
  useShortcut('mod+b', null, { description: 'Fold the sidebar', group: 'Navigation' })
  return (
    <label>
      Note <input />
    </label>
  )
}

describe('keyboard shortcuts', () => {
  it('hear a sequence of keys, and keys with mod even while text is typed', async () => {
    const user = userEvent.setup()
    const go = vi.fn()
    const search = vi.fn()
    render(
      <IoitiProvider>
        <Page go={go} search={search} />
      </IoitiProvider>,
    )

    await user.keyboard('g')
    await user.keyboard('o')
    expect(go).toHaveBeenCalledOnce()

    await user.click(screen.getByRole('textbox', { name: 'Note' }))
    await user.keyboard('go')
    expect(go).toHaveBeenCalledOnce()
    // jsdom names no platform: mod is Ctrl.
    await user.keyboard('{Control>}k{/Control}')
    expect(search).toHaveBeenCalledOnce()
  })

  it('wait while a dialog is open', async () => {
    const user = userEvent.setup()
    const go = vi.fn()
    render(
      <IoitiProvider>
        <Page go={go} search={() => {}} />
        <Dialog open onClose={() => {}} title="Edit">
          <p>Inside</p>
        </Dialog>
      </IoitiProvider>,
    )
    await user.keyboard('go')
    expect(go).not.toHaveBeenCalled()
  })

  it('are listed by group on ?, with their keys, once there is one to list', async () => {
    const user = userEvent.setup()
    function App() {
      const [page, setPage] = useState(false)
      return (
        <IoitiProvider>
          <button type="button" onClick={() => setPage(true)}>
            Open the page
          </button>
          {page && <Page go={() => {}} search={() => {}} />}
          <ShortcutsDialog />
        </IoitiProvider>
      )
    }
    render(<App />)

    await user.keyboard('?')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open the page' }))
    await user.keyboard('?')
    const dialog = await screen.findByRole('dialog', { name: 'Keyboard shortcuts' })
    const navigation = within(dialog).getByRole('heading', { name: 'Navigation' }).parentElement as HTMLElement
    expect(navigation).toHaveTextContent('Go to the orders')
    expect(navigation).toHaveTextContent('Fold the sidebar')
    expect(dialog).toHaveTextContent('Search')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('opens on its keys and closes on Escape: its keys wait while it is open, as every shortcut while a dialog is', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <IoitiProvider>
        <Page go={() => {}} search={() => {}} />
        <ShortcutsDialog onOpenChange={changed} />
      </IoitiProvider>,
    )
    await user.keyboard('?')
    await screen.findByRole('dialog', { name: 'Keyboard shortcuts' })
    expect(changed).toHaveBeenLastCalledWith(true)
    await user.keyboard('?')
    expect(changed).not.toHaveBeenCalledWith(false)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(changed).toHaveBeenLastCalledWith(false)
  })

  it('opens at first with defaultOpen, then holds itself, onOpenChange told', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <IoitiProvider>
        <Page go={() => {}} search={() => {}} />
        <ShortcutsDialog defaultOpen onOpenChange={changed} />
      </IoitiProvider>,
    )
    expect(await screen.findByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(changed).toHaveBeenLastCalledWith(false)
  })

  it('lists once the same keys registered twice for the same thing (a second sidebar)', async () => {
    const user = userEvent.setup()
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <IoitiProvider>
        <Page go={() => {}} search={() => {}} />
        <Page go={() => {}} search={() => {}} />
        <ShortcutsDialog />
      </IoitiProvider>,
    )
    await user.keyboard('?')
    const dialog = await screen.findByRole('dialog', { name: 'Keyboard shortcuts' })
    expect(within(dialog).getAllByText('Fold the sidebar')).toHaveLength(1)
    expect(errors).not.toHaveBeenCalledWith(expect.stringContaining('same key'), expect.anything(), expect.anything())
    errors.mockRestore()
  })
})
