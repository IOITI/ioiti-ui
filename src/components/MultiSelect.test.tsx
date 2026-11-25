import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { MultiSelect } from './MultiSelect.js'
import type { MultiSelectOption } from './MultiSelect.js'
import { Dialog } from './ui/settle-modal.js'

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

  it('says it opens a list, by an arrow a click goes through, beside its clear button once something is chosen', async () => {
    const user = userEvent.setup()
    const { container } = render(<MultiSelect label="Cities" options={CITIES} />)
    const arrow = container.querySelector('svg.lucide-chevrons-up-down')
    expect(arrow).toHaveAttribute('aria-hidden', 'true')
    expect(arrow).toHaveClass('pointer-events-none')

    await user.click(screen.getByRole('combobox', { name: 'Cities' }))
    await user.click(within(screen.getByRole('listbox', { name: 'Cities' })).getByRole('option', { name: 'Lyon' }))
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    expect(container.querySelector('svg.lucide-chevrons-up-down')).toBeInTheDocument()
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

  it('moves with the arrows, Home and End through its options as they are drawn, group by group, the search narrowing them too', async () => {
    const user = userEvent.setup()
    // Paris listed after Berlin, drawn under France with Lyon; Bremen under Germany with Berlin.
    const APART: MultiSelectOption[] = [
      { value: 'lyon', label: 'Lyon', group: 'France' },
      { value: 'berlin', label: 'Berlin', group: 'Germany' },
      { value: 'paris', label: 'Paris', group: 'France' },
      { value: 'bremen', label: 'Bremen', group: 'Germany' },
    ]
    render(<MultiSelect label="Cities" options={APART} />)
    const field = screen.getByRole('combobox', { name: 'Cities' })
    const active = () => document.getElementById(field.getAttribute('aria-activedescendant') ?? '')?.textContent

    await user.click(field)
    const list = screen.getByRole('listbox', { name: 'Cities' })
    expect(within(list).getAllByRole('option').map((option) => option.textContent)).toEqual(['Lyon', 'Paris', 'Berlin', 'Bremen'])
    expect(active()).toBe('Lyon')
    const seen: (string | undefined)[] = []
    for (let step = 0; step < 4; step++) {
      await user.keyboard('{ArrowDown}')
      seen.push(active())
    }
    expect(seen).toEqual(['Paris', 'Berlin', 'Bremen', 'Lyon'])
    await user.keyboard('{ArrowUp}')
    expect(active()).toBe('Bremen')
    await user.keyboard('{Home}')
    expect(active()).toBe('Lyon')
    await user.keyboard('{End}')
    expect(active()).toBe('Bremen')
    await user.keyboard('{Home}{ArrowDown}{Enter}')
    expect(screen.getByRole('button', { name: 'Remove Paris' })).toBeInTheDocument()

    // Narrowed to Berlin, Paris and Bremen: the first drawn made active, ↓ on to the next drawn.
    await user.type(field, 'r')
    expect(within(list).getAllByRole('option').map((option) => option.textContent)).toEqual(['Berlin', 'Bremen', 'Paris'])
    expect(active()).toBe('Berlin')
    await user.keyboard('{ArrowDown}')
    expect(active()).toBe('Bremen')
  })

  it('says it is full above its list, describing the options it holds back, and to a screen reader once as it comes to be', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Cities" options={CITIES} max={2} defaultValue={['lyon']} />)
    const field = screen.getByRole('combobox', { name: 'Cities' })
    const said = () => document.querySelector('[data-ioiti-announcer="polite"]')
    const limit = '2 at most: remove one to choose another.'

    await user.click(field)
    const list = screen.getByRole('listbox', { name: 'Cities' })
    const layer = list.parentElement!
    expect(within(layer).queryByText(limit)).not.toBeInTheDocument()

    await user.click(within(list).getByRole('option', { name: 'Paris' }))
    // Shown where it was, in no live region drawn with its words.
    const shown = within(layer).getByText(limit)
    expect(shown).not.toHaveAttribute('role')
    expect(shown).not.toHaveAttribute('aria-live')
    // Describing what it holds back: Berlin; not what is chosen, nor Rome, dimmed of its own.
    expect(within(list).getByRole('option', { name: 'Berlin' })).toHaveAccessibleDescription(limit)
    expect(within(list).getByRole('option', { name: 'Paris' })).not.toHaveAttribute('aria-describedby')
    expect(within(list).getByRole('option', { name: 'Rome' })).not.toHaveAttribute('aria-describedby')
    await waitFor(() => expect(said()).toHaveTextContent(limit))

    // No longer full: shown nowhere, describing nothing.
    await user.click(within(list).getByRole('option', { name: 'Paris' }))
    expect(within(layer).queryByText(limit)).not.toBeInTheDocument()
    expect(within(list).getByRole('option', { name: 'Berlin' })).not.toHaveAttribute('aria-describedby')
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

  it('says nothing matches beside its list, not in it, which it describes, and to a screen reader once as it comes', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Cities" options={CITIES} />)
    const field = screen.getByRole('combobox', { name: 'Cities' })
    const said = () => document.querySelector('[data-ioiti-announcer="polite"]')

    await user.type(field, 'zz')
    const list = screen.getByRole('listbox', { name: 'Cities' })
    // A listbox holds options alone: empty, described by the words beside it.
    expect(list).toBeEmptyDOMElement()
    expect(list).toHaveAccessibleDescription('Nothing matches')
    expect(field).not.toHaveAttribute('aria-activedescendant')
    await waitFor(() => expect(said()).toHaveTextContent('Nothing matches'))

    // Once: not again at each letter typed while nothing matches (said again, it is emptied first).
    await user.type(field, 'z')
    expect(said()).toHaveTextContent('Nothing matches')

    // Something matches again: the list holds it, described by nothing.
    await user.clear(field)
    await user.type(field, 'ly')
    expect(within(list).getByRole('option', { name: 'Lyon' })).toBeInTheDocument()
    expect(list).not.toHaveAttribute('aria-describedby')
  })

  it('closes its list on Escape, not the dialog around it', async () => {
    const user = userEvent.setup()
    render(
      <Dialog open onClose={() => {}} title="Send to">
        <MultiSelect label="Cities" options={CITIES} />
      </Dialog>,
    )
    await user.click(screen.getByRole('combobox', { name: 'Cities' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(screen.getByRole('dialog', { name: 'Send to' })).toBeInTheDocument()
  })
})
