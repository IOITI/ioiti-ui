import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MultiSelect } from './MultiSelect.js'
import type { MultiSelectOption } from './MultiSelect.js'
import { SettleModal } from './ui/settle-modal.js'

const CITIES: MultiSelectOption[] = [
  { value: 'lyon', label: 'Lyon', group: 'France' },
  { value: 'paris', label: 'Paris', group: 'France' },
  { value: 'berlin', label: 'Berlin', group: 'Germany' },
  { value: 'rome', label: 'Rome', group: 'Italy', disabled: true },
]

describe('MultiSelect', () => {
  it('filters as one types, ticks with Enter, each value a chip', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<MultiSelect label="Cities" options={CITIES} onChange={changed} />)
    const field = screen.getByRole('combobox', { name: 'Cities' })

    await user.type(field, 'pa')
    const list = screen.getByRole('listbox', { name: 'Cities' })
    expect(within(list).getAllByRole('option').map((option) => option.textContent)).toEqual(['Paris'])
    expect(field).toHaveAttribute('aria-activedescendant', within(list).getByRole('option').id)

    await user.keyboard('{Enter}')
    expect(changed).toHaveBeenLastCalledWith(['paris'])
    expect(within(list).getByRole('option', { name: 'Paris' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Remove Paris' })).toBeInTheDocument()
    expect(field).toHaveFocus()
  })

  it('moves with the arrows past nothing, and removes the last chip with Backspace', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Cities" options={CITIES} defaultValue={['lyon']} />)
    const field = screen.getByRole('combobox', { name: 'Cities' })

    await user.click(field)
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(screen.getByRole('button', { name: 'Remove Berlin' })).toBeInTheDocument()
    await user.keyboard('{Backspace}')
    expect(screen.queryByRole('button', { name: 'Remove Berlin' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Lyon' })).toBeInTheDocument()
  })

  it('makes a value of what is typed, where it may', async () => {
    const user = userEvent.setup()
    function Tags() {
      const [options, setOptions] = useState<MultiSelectOption[]>([{ value: 'urgent', label: 'urgent' }])
      return (
        <MultiSelect
          label="Tags"
          options={options}
          onCreateOption={(text) => {
            setOptions((now) => [...now, { value: text, label: text }])
            return text
          }}
        />
      )
    }
    render(<Tags />)
    await user.type(screen.getByRole('combobox', { name: 'Tags' }), 'gift{Enter}')
    expect(screen.getByRole('button', { name: 'Remove gift' })).toBeInTheDocument()
  })

  it('closes its list on Escape, not the dialog around it', async () => {
    const user = userEvent.setup()
    render(
      <SettleModal open onClose={() => {}} title="Send to">
        <MultiSelect label="Cities" options={CITIES} />
      </SettleModal>,
    )
    await user.click(screen.getByRole('combobox', { name: 'Cities' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(screen.getByRole('dialog', { name: 'Send to' })).toBeInTheDocument()
  })
})
