import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { StatusIsland } from './ui/dynamic-island.js'

const island = (
  <StatusIsland label="Import" compact={<span>3 running</span>}>
    <p>Products: 504 of 1,204</p>
  </StatusIsland>
)

describe('StatusIsland', () => {
  it('says its name before what its pill shows, and names its close button by it', async () => {
    const user = userEvent.setup()
    render(island)
    await user.click(screen.getByRole('button', { name: 'Import: 3 running' }))
    expect(screen.getByRole('region', { name: 'Import' })).toHaveTextContent('Products: 504 of 1,204')
    expect(screen.getByRole('button', { name: 'Close import' })).toHaveFocus()
  })

  it("says them in the language given, or in an application's own words", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        {island}
      </IoitiProvider>,
    )
    const pill = screen.getByRole('button', { name: /^Import/ })
    expect(pill).toHaveAccessibleName('Import : 3 running')
    await user.click(pill)
    expect(screen.getByRole('button', { name: 'Fermer import' })).toHaveFocus()
    unmount()

    render(<IoitiProvider messages={{ toast: { closeIsland: (label: string) => `Hide ${label}` } }}>{island}</IoitiProvider>)
    await user.click(screen.getByRole('button', { name: 'Import: 3 running' }))
    expect(screen.getByRole('button', { name: 'Hide Import' })).toBeInTheDocument()
  })
})
