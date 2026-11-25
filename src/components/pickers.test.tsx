import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { fr } from '../locales/fr.js'
import { Field } from './Field.js'
import { IoitiProvider } from './IoitiProvider.js'
import type { MessagesOverride } from './locale-context.js'
import { Calendar } from './ui/calendar.js'
import { Combobox } from './ui/combobox.js'
import { DatePicker, DateRangePicker } from './ui/date-picker.js'

const NOV = new Date(2026, 10, 14)
const NOV_20 = new Date(2026, 10, 20)

/** An application's own words, given over English's. */
const OWN_WORDS: MessagesOverride = { date: { previousMonth: 'Back a month', pickerDialog: 'Pick the day', datePlaceholder: 'When?' } }

/** A day of the calendar shown, by the date it says (data-date: year-month-day, unpadded). */
const day = (iso: string) => document.querySelector<HTMLElement>(`[data-date="${iso}"]`)!
/** The column of its week a day is in, 0 for the first day of the week. */
function columnOf(iso: string) {
  const cell = day(iso).closest('[role="gridcell"]')!
  return [...cell.parentElement!.children].indexOf(cell)
}
/** The heads of the days of the week, in their order. */
const heads = () => document.querySelector('div[aria-hidden="true"]')?.textContent
/** A day's name, as a locale writes it in full. */
const fullDate = (date: Date, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date)

describe('a calendar', () => {
  it('speaks English as Britain writes it outside a provider: its weeks start on Monday', () => {
    render(<Calendar defaultMonth={NOV} />)
    expect(screen.getByRole('grid')).toHaveAccessibleName('November 2026')
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
    expect(heads()).toBe('MTWTFSS')
    // 1 Nov 2026, a Sunday, ends its week.
    expect(columnOf('2026-11-1')).toBe(6)
    expect(day('2026-11-14')).toHaveAccessibleName(fullDate(NOV, 'en-GB'))
  })

  it('starts its weeks on the provider’s day, Sunday in the United States: its heads, its grid, Home and End agree', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="en-US">
        <Calendar defaultMonth={NOV} />
      </IoitiProvider>,
    )
    expect(heads()).toBe('SMTWTFS')
    expect(columnOf('2026-11-1')).toBe(0)
    expect(day('2026-11-14')).toHaveAccessibleName(fullDate(NOV, 'en-US'))
    // Saturday 14 Nov: its week runs from Sunday the 8th to Saturday the 14th.
    await user.click(day('2026-11-14'))
    await user.keyboard('{Home}')
    expect(day('2026-11-8')).toHaveFocus()
    await user.keyboard('{End}')
    expect(day('2026-11-14')).toHaveFocus()
  })

  it('goes to the Monday and the Sunday of a week that starts on Monday', async () => {
    const user = userEvent.setup()
    render(<Calendar defaultMonth={NOV} />)
    await user.click(day('2026-11-14'))
    await user.keyboard('{Home}')
    expect(day('2026-11-9')).toHaveFocus()
    await user.keyboard('{End}')
    expect(day('2026-11-15')).toHaveFocus()
  })

  it('speaks French with a French provider: its month, its days, its buttons, its weeks from Monday', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Calendar defaultMonth={NOV} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('grid')).toHaveAccessibleName('novembre 2026')
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toBeInTheDocument()
    expect(heads()).toBe('LMMJVSD')
    expect(columnOf('2026-11-1')).toBe(6)
    expect(day('2026-11-14')).toHaveAccessibleName('samedi 14 novembre 2026')
  })

  it('keeps its own locale and first day over the provider’s, its words the provider’s', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Calendar defaultMonth={NOV} locale="en-GB" weekStartsOn={0} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('grid')).toHaveAccessibleName('November 2026')
    expect(heads()).toBe('SMTWTFS')
    expect(columnOf('2026-11-1')).toBe(0)
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeInTheDocument()
  })

  it('says an application’s own words, English’s for the others', () => {
    render(
      <IoitiProvider messages={OWN_WORDS}>
        <Calendar defaultMonth={NOV} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Back a month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })
})

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

  it('writes its day, its range and its placeholders as en-GB does outside a provider', () => {
    render(
      <>
        <DatePicker aria-label="Due" defaultValue={NOV} />
        <DatePicker aria-label="Paid" />
        <DateRangePicker aria-label="Period" defaultValue={{ from: NOV, to: NOV_20 }} />
        <DateRangePicker aria-label="From" defaultValue={{ from: NOV, to: null }} />
        <DateRangePicker aria-label="Range" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Due' })).toHaveTextContent('14 Nov 2026')
    expect(screen.getByRole('button', { name: 'Paid' })).toHaveTextContent('Pick a date')
    expect(screen.getByRole('button', { name: 'Period' })).toHaveTextContent('14 Nov 2026 – 20 Nov 2026')
    expect(screen.getByRole('button', { name: 'From' })).toHaveTextContent('14 Nov 2026 – …')
    expect(screen.getByRole('button', { name: 'Range' })).toHaveTextContent('Pick a range')
  })

  it('speaks French with a French provider: its days, its ranges, its placeholders, its calendar', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <DatePicker aria-label="Échéance" defaultValue={NOV} />
        <DatePicker aria-label="Payée le" />
        <DateRangePicker aria-label="Période" defaultValue={{ from: NOV, to: NOV_20 }} />
        <DateRangePicker aria-label="À partir du" defaultValue={{ from: NOV, to: null }} />
        <DateRangePicker aria-label="Plage" />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Échéance' })).toHaveTextContent('14 nov. 2026')
    expect(screen.getByRole('button', { name: 'Payée le' })).toHaveTextContent('Sélectionner une date')
    expect(screen.getByRole('button', { name: 'Période' })).toHaveTextContent('14 nov. 2026 – 20 nov. 2026')
    expect(screen.getByRole('button', { name: 'À partir du' })).toHaveTextContent('14 nov. 2026 – …')
    expect(screen.getByRole('button', { name: 'Plage' })).toHaveTextContent('Sélectionner une période')

    await user.click(screen.getByRole('button', { name: 'Échéance' }))
    const calendar = await screen.findByRole('dialog', { name: 'Choisir une date' })
    expect(within(calendar).getByRole('grid')).toHaveAccessibleName('novembre 2026')
    expect(within(calendar).getByRole('button', { name: 'Mois précédent' })).toBeInTheDocument()
    expect(heads()).toBe('LMMJVSD')
    expect(day('2026-11-14')).toHaveAccessibleName('samedi 14 novembre 2026')
    await expectAccessible(document.body)
  })

  it('writes its day as Americans do in the United States, its calendar’s weeks from Sunday', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="en-US">
        <DatePicker aria-label="Due" defaultValue={NOV} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'Due' })).toHaveTextContent('Nov 14, 2026')
    await user.click(screen.getByRole('button', { name: 'Due' }))
    await screen.findByRole('dialog', { name: 'Choose date' })
    expect(heads()).toBe('SMTWTFS')
    expect(columnOf('2026-11-1')).toBe(0)
  })

  it('says an application’s own words, its own placeholder first', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider messages={OWN_WORDS}>
        <DatePicker />
        <DatePicker placeholder="Not paid yet" />
      </IoitiProvider>,
    )
    expect(screen.getByRole('button', { name: 'When?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Not paid yet' }))
    const calendar = await screen.findByRole('dialog', { name: 'Pick the day' })
    expect(within(calendar).getByRole('button', { name: 'Back a month' })).toBeInTheDocument()
    expect(within(calendar).getByRole('button', { name: 'Next month' })).toBeInTheDocument()
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
    expect(screen.getByRole('listbox', { name: 'Country of delivery' })).toHaveAccessibleDescription('No results.')
    await expectAccessible(document.body)
  })

  it('says it found nothing beside its list, which it describes, and to a screen reader, as MultiSelect says it', async () => {
    const user = userEvent.setup()
    render(<Combobox aria-label="Carrier" options={[{ value: 'post', label: 'Post' }, { value: 'courier', label: 'Courier' }]} />)
    await user.click(screen.getByRole('combobox', { name: 'Carrier' }))
    const search = screen.getByPlaceholderText('Search…')
    await waitFor(() => expect(search).toHaveFocus())

    await user.keyboard('xyz')
    const list = screen.getByRole('listbox', { name: 'Carrier' })
    expect(list).toBeEmptyDOMElement()
    expect(list).toHaveAccessibleDescription('No results.')
    await waitFor(() => expect(document.querySelector('[data-ioiti-announcer="polite"]')).toHaveTextContent('No results.'))
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

// What the package says of a former name, once, in development.
const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/
const deprecations = (warn: { mock: { calls: unknown[][] } }) => warn.mock.calls.filter(([message]) => DEPRECATED.test(String(message)))

describe('a combobox telling its choice', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const OPTIONS = [
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
  ]

  it('tells onChange, held by itself or by the page, and says nothing of it', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const changed = vi.fn()
    const { unmount } = render(<Combobox aria-label="Country" options={OPTIONS} onChange={changed} />)
    const trigger = screen.getByRole('combobox', { name: 'Country' })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Germany' }))
    expect(changed).toHaveBeenLastCalledWith('de')
    expect(trigger).toHaveTextContent('Germany')
    unmount()

    // Held by the page: told, and shown once the page takes it.
    render(<Combobox aria-label="Country" options={OPTIONS} value="fr" onChange={changed} />)
    const held = screen.getByRole('combobox', { name: 'Country' })
    await user.click(held)
    await user.click(screen.getByRole('option', { name: 'Germany' }))
    expect(changed).toHaveBeenLastCalledWith('de')
    expect(held).toHaveTextContent('France')
    expect(deprecations(warn)).toHaveLength(0)
  })

  it('still tells onValueChange, said once in development, onChange alone when both are given', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const told = vi.fn()
    const { rerender, unmount } = render(<Combobox aria-label="Country" options={OPTIONS} onValueChange={told} />)
    rerender(<Combobox aria-label="Country" options={OPTIONS} onValueChange={told} />)
    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(screen.getByRole('option', { name: 'Germany' }))
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(told).toHaveBeenCalledWith('de')
    const said = deprecations(warn)
    expect(said).toHaveLength(1)
    expect(String(said[0][0])).toContain("(Combobox's onValueChange: onChange)")
    unmount()

    const changed = vi.fn()
    told.mockClear()
    render(<Combobox aria-label="Country" options={OPTIONS} onChange={changed} onValueChange={told} />)
    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(screen.getByRole('option', { name: 'France' }))
    expect(changed).toHaveBeenCalledWith('fr')
    expect(told).not.toHaveBeenCalled()
  })
})
