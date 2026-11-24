import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Field } from './Field.js'
import { Combobox } from './ui/combobox.js'
import { DatePicker, DateRangePicker } from './ui/date-picker.js'

const NOV = new Date(2026, 10, 14)

describe('a date picker', () => {
  it('is named and described by a Field around it, and marked by its error', () => {
    render(
      <Field label="Delivery" description="A working day" error="Choose a day after today">
        <DatePicker defaultMonth={NOV} />
      </Field>,
    )
    const trigger = screen.getByRole('button', { name: 'Delivery' })
    expect(trigger).toHaveAccessibleDescription('A working day Choose a day after today')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger.className).toContain('border-negative/60')
    expect(trigger.className).not.toContain('dark:border-neutral-800')
  })

  it('is named where no label is, and by what it points to', () => {
    render(
      <>
        <DatePicker aria-label="Due date" />
        <span id="range-name">Period</span>
        <DateRangePicker aria-labelledby="range-name" id="period" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Due date' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Period' })).toHaveAttribute('id', 'period')
  })

  it('opens its calendar over the page, in document.body, which a click in a label around it leaves open', async () => {
    const user = userEvent.setup()
    render(
      <Field label="Delivery">
        <DatePicker defaultMonth={NOV} />
      </Field>,
    )
    await user.click(screen.getByRole('button', { name: 'Delivery' }))
    const calendar = await screen.findByRole('dialog', { name: 'Choose date' })
    expect(calendar.parentElement).toBe(document.body)
    expect(screen.getByText('Delivery').closest('label')).not.toContainElement(calendar)
    // The focus goes to the day to choose.
    await waitFor(() => expect(calendar).toContainElement(document.activeElement as HTMLElement))

    await user.click(calendar)
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose date' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Delivery' })).toHaveFocus()
  })
})

describe('a combobox', () => {
  it('is marked by its error, named and described, its list over the page in document.body', async () => {
    const user = userEvent.setup()
    render(
      <>
        <span id="carrier">Carrier</span>
        <Combobox
          aria-labelledby="carrier"
          aria-describedby="carrier-error"
          error
          options={[
            { value: 'post', label: 'Post' },
            { value: 'courier', label: 'Courier' },
          ]}
        />
        <span id="carrier-error">Choose a carrier</span>
      </>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Carrier' })
    expect(trigger).toHaveAccessibleDescription('Choose a carrier')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger.className).toContain('border-negative/60')
    await expectAccessible(document.body)

    await user.click(trigger)
    const list = await screen.findByRole('listbox')
    expect(list.closest('.glass-float')?.parentElement).toBe(document.body)
    // Its search and its list are named by what names it.
    expect(list).toHaveAccessibleName('Carrier')
    expect(screen.getByPlaceholderText('Search…')).toHaveAccessibleName('Carrier')
    await expectAccessible(document.body)

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('names its search and its list after its Field’s label, as the search takes the focus', async () => {
    const user = userEvent.setup()
    render(
      <Field label="Country of delivery" htmlFor="country" description="Where the parcel goes">
        <Combobox id="country" options={[{ value: 'fr', label: 'France' }, { value: 'de', label: 'Germany' }]} defaultValue="fr" />
      </Field>,
    )

    await user.click(screen.getByRole('combobox', { name: 'Country of delivery' }))
    const search = screen.getByPlaceholderText('Search…')
    await waitFor(() => expect(search).toHaveFocus())
    expect(search).toHaveAccessibleName('Country of delivery')
    expect(screen.getByRole('listbox', { name: 'Country of delivery' })).toContainElement(screen.getByRole('option', { name: 'France' }))
    await expectAccessible(document.body)

    // Its search finds, its list follows: both keep their name. Nothing found is said beside the list, which holds
    // options alone.
    await user.keyboard('ger')
    expect(screen.getByRole('listbox', { name: 'Country of delivery' })).toContainElement(screen.getByRole('option', { name: 'Germany' }))
    await user.keyboard('xyz')
    expect(screen.getByRole('listbox', { name: 'Country of delivery' })).toBeEmptyDOMElement()
    expect(screen.getByText('No results.')).toBeInTheDocument()
    await expectAccessible(document.body)
  })

  it('names them by its aria-label, or by the words of a label around it, its own left out', async () => {
    const user = userEvent.setup()
    const options = [{ value: 'post', label: 'Post' }]
    const { unmount } = render(<Combobox aria-label="Carrier" options={options} />)
    await user.click(screen.getByRole('combobox', { name: 'Carrier' }))
    expect(screen.getByRole('listbox', { name: 'Carrier' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search…')).toHaveAccessibleName('Carrier')
    await expectAccessible(document.body)
    unmount()

    render(
      <Field label="Team">
        <Combobox options={options} defaultValue="post" />
      </Field>,
    )
    await user.click(screen.getByRole('combobox', { name: 'Team' }))
    expect(screen.getByRole('listbox', { name: 'Team' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search…')).toHaveAccessibleName('Team')
    await expectAccessible(document.body)
  })
})
