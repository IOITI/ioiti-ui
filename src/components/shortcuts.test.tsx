import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { IoitiProvider } from './IoitiProvider.js'
import { ShortcutsDialog } from './ShortcutsDialog.js'
import { useShortcut } from './shortcuts-context.js'
import { SettleModal } from './ui/settle-modal.js'

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
        <SettleModal open onClose={() => {}} title="Edit">
          <p>Inside</p>
        </SettleModal>
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
})
