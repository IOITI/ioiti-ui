import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { RecoveryLedger } from './ui/recovery-ledger.js'
import type { LedgerEntry } from './ui/recovery-ledger.js'

const SAVED = new Date('2026-10-27T11:00:00Z')

const ENTRIES: LedgerEntry[] = [
  { id: 'v2', action: 'Saved by Ana', description: 'Spring prices', timestamp: SAVED, details: { diff: '- 6.40\n+ 5.90' } },
  { id: 'v1', action: 'Imported', description: 'First list', timestamp: '7 Nov, 11:20' },
]

afterEach(() => vi.restoreAllMocks())

/** jsdom lays nothing out: the diff made wider than its box, so that it scrolls and is named. */
function wideDiff() {
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return this.querySelector(':scope > pre') ? 900 : 0
  })
}

describe('RecoveryLedger', () => {
  it('says its words in English by default: its title, its entries counted, its restore buttons named by their entry', async () => {
    wideDiff()
    const user = userEvent.setup()
    render(<RecoveryLedger entries={ENTRIES} currentEntryId="v1" onRestore={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Recovery ledger' })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Recovery ledger' })).toBeInTheDocument()
    expect(screen.getByText('2 snapshots')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revert: Saved by Ana' })).toHaveTextContent('Revert')
    expect(screen.getByText('Current head')).toBeInTheDocument()
    // A date written as the locale writes one (en-GB outside a provider), not as the browser's would.
    expect(screen.getByText(SAVED.toLocaleString('en-GB'))).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Saved by Ana/, expanded: false }))
    expect(await screen.findByRole('region', { name: 'Changes' })).toHaveTextContent('+ 5.90')
  })

  it('counts one entry as one', () => {
    render(<RecoveryLedger entries={ENTRIES.slice(0, 1)} />)
    expect(screen.getByText('1 snapshot')).toBeInTheDocument()
  })

  it('says them in the language given, its date in its locale', async () => {
    wideDiff()
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <RecoveryLedger entries={ENTRIES} currentEntryId="v1" onRestore={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Points de restauration' })).toBeInTheDocument()
    expect(screen.getByText('2 instantanés')).toBeInTheDocument()
    // A no-break space before the colon, as French writes one.
    expect(screen.getByRole('button', { name: 'Restaurer\u00a0: Saved by Ana' })).toHaveTextContent('Restaurer')
    expect(screen.getByText('Version actuelle')).toBeInTheDocument()
    expect(screen.getByText(SAVED.toLocaleString('fr-FR'))).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Saved by Ana/, expanded: false }))
    expect(await screen.findByRole('region', { name: 'Modifications' })).toBeInTheDocument()
  })

  it('takes the words it is given over the language\'s, and an application\'s own over English\'s', () => {
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <RecoveryLedger entries={ENTRIES} title="Versions de la liste" countLabel="2 versions" restoreLabel="Rétablir" onRestore={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Versions de la liste' })).toBeInTheDocument()
    expect(screen.getByText('2 versions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rétablir\u00a0: Imported' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider messages={{ ledger: { count: (count: number) => `${count} saved versions`, restore: 'Restore' } }}>
        <RecoveryLedger entries={ENTRIES} onRestore={() => {}} />
      </IoitiProvider>,
    )
    expect(screen.getByText('2 saved versions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restore: Imported' })).toBeInTheDocument()
  })
})
