import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { SplitButton } from './ui/split-button.js'

describe('SplitButton', () => {
  it('opens its menu in the page’s body, out of what would cut it, and chooses from the keyboard', async () => {
    const user = userEvent.setup()
    const exported = vi.fn()
    render(
      <div data-testid="frame" style={{ overflow: 'hidden' }}>
        <SplitButton
          label="Save"
          onClick={() => {}}
          options={[
            { value: 'draft', label: 'Save as draft' },
            { value: 'export', label: 'Export', onSelect: exported },
          ]}
        />
      </div>,
    )

    const chevron = screen.getByRole('button', { name: 'More Save options' })
    await user.click(chevron)
    const menu = await screen.findByRole('menu', { name: 'More Save options' })
    expect(screen.getByTestId('frame')).not.toContainElement(menu)
    expect(menu.parentElement).toBe(document.body)
    await waitFor(() => expect(menu).toHaveFocus())

    await user.keyboard('{ArrowDown}{Enter}')
    expect(exported).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(chevron).toHaveFocus()
  })

  it('closes on Escape and gives the focus back to its chevron', async () => {
    const user = userEvent.setup()
    render(<SplitButton label="Save" onClick={() => {}} options={[{ value: 'draft', label: 'Save as draft' }]} />)

    const chevron = screen.getByRole('button', { name: 'More Save options' })
    await user.click(chevron)
    await screen.findByRole('menu')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(chevron).toHaveFocus()
  })

  it('names its chevron and its menu in the language given, after its label, its own menuLabel first', async () => {
    const user = userEvent.setup()
    const options = [{ value: 'draft', label: 'Enregistrer comme brouillon' }]
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <SplitButton label="Enregistrer" onClick={() => {}} options={options} />
      </IoitiProvider>,
    )
    const chevron = screen.getByRole('button', { name: 'Autres options pour «\u00a0Enregistrer\u00a0»' })
    await user.click(chevron)
    expect(await screen.findByRole('menu', { name: 'Autres options pour «\u00a0Enregistrer\u00a0»' })).toBeInTheDocument()
    unmount()

    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <SplitButton label="Enregistrer" menuLabel="Autres façons d’enregistrer" onClick={() => {}} options={options} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Autres façons d’enregistrer' })).toBeInTheDocument()
  })
})
