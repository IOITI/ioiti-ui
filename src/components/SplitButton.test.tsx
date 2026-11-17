import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

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
})
