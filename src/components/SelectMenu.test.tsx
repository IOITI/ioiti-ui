import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Field } from './Field.js'
import { Dialog } from './ui/settle-modal.js'
import { SelectMenu } from './ui/spring-select.js'
import type { SelectMenuOption } from './ui/spring-select.js'

const MONTHS: SelectMenuOption[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label) => ({ value: label.slice(0, 3).toLowerCase(), label, disabled: label === 'February' || label === 'June' }))

const STAGES: SelectMenuOption[] = [
  { value: 'archived', label: 'Archived', disabled: true },
  { value: 'backlog', label: 'Backlog' },
  { value: 'doing', label: 'Doing' },
  { value: 'done', label: 'Done' },
  { value: 'dropped', label: 'Dropped', disabled: true },
]

const COUNTRIES: SelectMenuOption[] = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'ge', label: 'Georgia' },
  { value: 'gh', label: 'Ghana' },
  { value: 'gr', label: 'Greece', disabled: true },
  { value: 'ci', label: 'Côte d’Ivoire' },
  { value: 'nc', label: 'New Caledonia' },
  { value: 'nz', label: 'New Zealand' },
]

const PLANS: SelectMenuOption[] = [
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
  { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
]

const LANGUAGES: SelectMenuOption[] = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

const combobox = (name = 'Month') => screen.getByRole('combobox', { name })

/** The words of the option a combobox's keys are on (its `aria-activedescendant`), or null. */
function activeOf(trigger: HTMLElement): string | null {
  const id = trigger.getAttribute('aria-activedescendant')
  return id ? (document.getElementById(id)?.textContent ?? null) : null
}

const closed = () => waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())

/** Longer than what keeps the letters typed as one search. */
const pause = () => new Promise((resolve) => setTimeout(resolve, 600))

describe('SelectMenu', () => {
  describe('opens from its trigger’s keys, the focus staying on it', () => {
    for (const [keys, what] of [
      ['{ArrowDown}', 'ArrowDown'],
      ['{ArrowUp}', 'ArrowUp'],
      ['{Enter}', 'Enter'],
      [' ', 'Space'],
      ['{Alt>}{ArrowDown}{/Alt}', 'Alt+ArrowDown'],
    ]) {
      it(`with ${what}, on the option chosen`, async () => {
        const user = userEvent.setup()
        render(<SelectMenu label="Month" options={MONTHS} defaultValue="may" />)
        await user.tab()
        const trigger = combobox()
        expect(trigger).toHaveFocus()
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(trigger).not.toHaveAttribute('aria-activedescendant')

        await user.keyboard(keys)
        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('listbox', { name: 'Month' }).id)
        expect(activeOf(trigger)).toBe('May')
        expect(trigger).toHaveFocus()
      })
    }

    it('on the first option that can be chosen, when none is chosen', async () => {
      const user = userEvent.setup()
      render(<SelectMenu label="Stage" options={STAGES} />)
      await user.tab()
      await user.keyboard('{ArrowDown}')
      expect(activeOf(combobox('Stage'))).toBe('Backlog')
    })

    it('with Home and End, on the first and the last that can be chosen', async () => {
      const user = userEvent.setup()
      render(<SelectMenu label="Stage" options={STAGES} defaultValue="doing" />)
      await user.tab()
      const trigger = combobox('Stage')
      await user.keyboard('{End}')
      expect(activeOf(trigger)).toBe('Done')
      await user.keyboard('{Escape}')
      await closed()
      await user.keyboard('{Home}')
      expect(activeOf(trigger)).toBe('Backlog')
    })
  })

  it('moves with the arrows, Home, End, PageUp and PageDown, past what cannot be chosen, to the ends and no further', async () => {
    const user = userEvent.setup()
    render(<SelectMenu label="Month" options={MONTHS} />)
    await user.tab()
    const trigger = combobox()
    const option = (name: string) => screen.getByRole('option', { name })

    await user.keyboard('{ArrowDown}')
    expect(activeOf(trigger)).toBe('January')
    await user.keyboard('{ArrowUp}')
    expect(activeOf(trigger)).toBe('January')
    await user.keyboard('{ArrowDown}')
    expect(activeOf(trigger)).toBe('March')
    expect(trigger).toHaveAttribute('aria-activedescendant', option('March').id)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(activeOf(trigger)).toBe('July')
    await user.keyboard('{ArrowUp}')
    expect(activeOf(trigger)).toBe('May')
    await user.keyboard('{Home}{PageDown}')
    expect(activeOf(trigger)).toBe('November')
    await user.keyboard('{PageDown}')
    expect(activeOf(trigger)).toBe('December')
    await user.keyboard('{ArrowDown}')
    expect(activeOf(trigger)).toBe('December')
    // Ten up is February, which cannot be chosen: the nearest before it.
    await user.keyboard('{PageUp}')
    expect(activeOf(trigger)).toBe('January')
    await user.keyboard('{End}')
    expect(activeOf(trigger)).toBe('December')

    // Marked as the option under the pointer is; the option that cannot be chosen marked so.
    expect(option('December')).toHaveClass('bg-surface-hover')
    expect(option('January')).not.toHaveClass('bg-surface-hover')
    expect(option('February')).toHaveAttribute('aria-disabled', 'true')
    expect(trigger).toHaveFocus()
  })

  it('keeps the option its keys are on in sight, the list scrolling, its padding around the option', async () => {
    const user = userEvent.setup()
    render(<SelectMenu label="Month" options={MONTHS} />)
    await user.tab()
    await user.keyboard('{ArrowDown}')
    // jsdom lays nothing out: a list 100px high, of options 40px high under its 4px of padding.
    const list = screen.getByRole('listbox')
    Object.defineProperty(list, 'clientHeight', { configurable: true, value: 100 })
    screen.getAllByRole('option').forEach((option, index) => {
      Object.defineProperty(option, 'offsetTop', { configurable: true, value: 4 + index * 40 })
      Object.defineProperty(option, 'offsetHeight', { configurable: true, value: 40 })
    })

    await user.keyboard('{End}')
    expect(list.scrollTop).toBe(4 + 11 * 40 + 40 + 4 - 100)
    await user.keyboard('{ArrowUp}')
    expect(list.scrollTop).toBe(4 + 11 * 40 + 40 + 4 - 100)
    await user.keyboard('{Home}')
    expect(list.scrollTop).toBe(0)
  })

  describe('goes to the option what is typed starts', () => {
    it('a letter, opening the list on it, then round the options it starts, past what cannot be chosen', async () => {
      const user = userEvent.setup()
      render(<SelectMenu label="Country" options={COUNTRIES} />)
      await user.tab()
      const trigger = combobox('Country')

      await user.keyboard('g')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(activeOf(trigger)).toBe('Germany')
      await user.keyboard('g')
      expect(activeOf(trigger)).toBe('Georgia')
      await user.keyboard('g')
      expect(activeOf(trigger)).toBe('Ghana')
      await user.keyboard('g')
      expect(activeOf(trigger)).toBe('Germany')
    })

    it('letters typed together, whatever their case and accents; a pause starts another search', async () => {
      const user = userEvent.setup()
      const changed = vi.fn()
      render(<SelectMenu label="Country" options={COUNTRIES} onChange={changed} />)
      await user.tab()
      const trigger = combobox('Country')

      await user.keyboard('gh')
      expect(activeOf(trigger)).toBe('Ghana')
      await pause()
      await user.keyboard('CO')
      expect(activeOf(trigger)).toBe('Côte d’Ivoire')
      await pause()
      // A space goes on with the words typed, where an option does.
      await user.keyboard('new z')
      expect(activeOf(trigger)).toBe('New Zealand')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      await user.keyboard('{Enter}')
      expect(changed).toHaveBeenCalledWith('nz')
      expect(trigger).toHaveTextContent('New Zealand')
    })

    it('a space after a letter, where no option goes on with it, chooses', async () => {
      const user = userEvent.setup()
      const changed = vi.fn()
      render(<SelectMenu label="Country" options={COUNTRIES} onChange={changed} />)
      await user.tab()
      await user.keyboard('f ')
      expect(changed).toHaveBeenCalledWith('fr')
      await closed()
    })
  })

  describe('chooses the option its keys are on, and closes', () => {
    for (const [keys, what] of [
      ['{Enter}', 'Enter'],
      [' ', 'Space'],
      ['{Alt>}{ArrowUp}{/Alt}', 'Alt+ArrowUp'],
    ]) {
      it(`with ${what}, its value shown, the focus on its trigger`, async () => {
        const user = userEvent.setup()
        const changed = vi.fn()
        render(<SelectMenu label="Month" options={MONTHS} onChange={changed} />)
        await user.tab()
        const trigger = combobox()
        await user.keyboard('{ArrowDown}{ArrowDown}')
        await user.keyboard(keys)

        expect(changed).toHaveBeenCalledOnce()
        expect(changed).toHaveBeenCalledWith('mar')
        expect(trigger).toHaveTextContent('March')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(trigger).not.toHaveAttribute('aria-activedescendant')
        await closed()
        expect(trigger).toHaveFocus()
      })
    }

    it('with Tab, the focus going on', async () => {
      const user = userEvent.setup()
      const changed = vi.fn()
      render(
        <>
          <SelectMenu label="Month" options={MONTHS} onChange={changed} />
          <button type="button">Next</button>
        </>,
      )
      await user.tab()
      await user.keyboard('{ArrowDown}{ArrowDown}')
      await user.tab()
      expect(changed).toHaveBeenCalledWith('mar')
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus()
      await closed()
    })

    it('held by the page, which shows the value it keeps', async () => {
      const user = userEvent.setup()
      function Plan() {
        const [plan, setPlan] = useState('team')
        return (
          <>
            <SelectMenu label="Plan" value={plan} onChange={setPlan} options={PLANS} />
            <p>Plan: {plan}</p>
          </>
        )
      }
      render(<Plan />)
      await user.tab()
      await user.keyboard('{ArrowDown}{ArrowUp}{Enter}')
      expect(screen.getByText('Plan: solo')).toBeInTheDocument()
      expect(combobox('Plan')).toHaveTextContent('Solo')
    })
  })

  it('closes on Escape without a choice, the focus staying on its trigger', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<SelectMenu label="Month" options={MONTHS} defaultValue="may" onChange={changed} />)
    await user.tab()
    const trigger = combobox()
    await user.keyboard('{ArrowDown}{ArrowDown}{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await closed()
    expect(changed).not.toHaveBeenCalled()
    expect(trigger).toHaveTextContent('May')
    expect(trigger).toHaveFocus()
  })

  it('keeps its keys inside a dialog: Escape closes the list, then the dialog', async () => {
    const user = userEvent.setup()
    const closeDialog = vi.fn()
    render(
      <Dialog open onClose={closeDialog} title="Schedule">
        <SelectMenu label="Month" options={MONTHS} />
      </Dialog>,
    )
    const trigger = combobox()
    await user.click(trigger)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(trigger).toHaveTextContent('March')
    await closed()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await closed()
    expect(closeDialog).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Schedule' })).toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(closeDialog).toHaveBeenCalledOnce()
  })

  it('chooses with a click, follows the pointer, and closes at a press elsewhere without a choice', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<SelectMenu label="Plan" options={PLANS} defaultValue="team" onChange={changed} />)
    const trigger = combobox('Plan')

    await user.click(trigger)
    expect(trigger).toHaveFocus()
    expect(activeOf(trigger)).toMatch(/^Team/)
    const solo = screen.getByRole('option', { name: /^Solo/ })
    const company = screen.getByRole('option', { name: /^Company/ })
    await user.hover(solo)
    expect(trigger).toHaveAttribute('aria-activedescendant', solo.id)
    // What cannot be chosen is neither pointed to nor chosen; a press in the list leaves the focus on the trigger.
    await user.hover(company)
    expect(trigger).toHaveAttribute('aria-activedescendant', solo.id)
    await user.click(company)
    expect(changed).not.toHaveBeenCalled()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(document.body)
    await closed()
    expect(changed).not.toHaveBeenCalled()

    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: /^Solo/ }))
    expect(changed).toHaveBeenCalledWith('solo')
    expect(trigger).toHaveTextContent('Solo')
    expect(trigger).toHaveFocus()
    await closed()

    // The option chosen again is no change.
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: /^Solo/ }))
    expect(changed).toHaveBeenCalledOnce()
  })

  it('takes the focus at a click on its label, as a select does, its list closed', async () => {
    const user = userEvent.setup()
    render(<SelectMenu label="Plan" options={PLANS} />)
    await user.click(screen.getByText('Plan'))
    expect(combobox('Plan')).toHaveFocus()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('is named by its label, its list too; else by aria-label or aria-labelledby', async () => {
    const user = userEvent.setup()
    render(
      <>
        <SelectMenu label="Plan" options={PLANS} />
        <SelectMenu aria-label="Language" options={LANGUAGES} />
        <span id="month-name">Month of the invoice</span>
        <SelectMenu aria-labelledby="month-name" options={MONTHS} />
      </>,
    )
    for (const name of ['Plan', 'Language', 'Month of the invoice']) {
      await user.click(screen.getByRole('combobox', { name }))
      expect(screen.getByRole('listbox', { name })).toBeInTheDocument()
      await user.keyboard('{Escape}')
      await closed()
    }
  })

  it('is described by its error, and marked invalid', () => {
    render(<SelectMenu label="Language" options={LANGUAGES} error="Choose the language the customer reads" />)
    const trigger = combobox('Language')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveAccessibleDescription('Choose the language the customer reads')
    expect(trigger.className).toContain('border-negative/60')
  })

  it('is named, described and marked by a Field beside it', () => {
    render(
      <Field label="Plan" htmlFor="plan" description="Billed every month" error="Choose a plan">
        <SelectMenu id="plan" options={PLANS} />
      </Field>,
    )
    const trigger = combobox('Plan')
    expect(trigger).toHaveAttribute('id', 'plan')
    expect(trigger).toHaveAccessibleDescription('Billed every month Choose a plan')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger.className).toContain('border-negative/60')
  })

  it('draws its list in document.body, as wide as its trigger, out of what would cut it', async () => {
    const user = userEvent.setup()
    const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(320)
    try {
      render(
        <div className="overflow-hidden">
          <SelectMenu label="Plan" options={PLANS} />
        </div>,
      )
      await user.click(combobox('Plan'))
      const layer = screen.getByRole('listbox').closest('.glass-float') as HTMLElement
      expect(layer.parentElement).toBe(document.body)
      expect(layer.style.position).toBe('fixed')
      expect(layer.style.width).toBe('320px')
    } finally {
      width.mockRestore()
    }
  })

  it('sends its value with a form, under its name', async () => {
    const user = userEvent.setup()
    render(
      <form aria-label="Invoice">
        <SelectMenu label="Month" name="month" options={MONTHS} defaultValue="may" />
      </form>,
    )
    const form = screen.getByRole('form', { name: 'Invoice' }) as HTMLFormElement
    expect(new FormData(form).get('month')).toBe('may')
    await user.click(combobox())
    await user.click(screen.getByRole('option', { name: 'July' }))
    expect(new FormData(form).get('month')).toBe('jul')
  })

  it('cannot be opened while disabled, and closes when it becomes so', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SelectMenu label="Language" options={LANGUAGES} defaultValue="en" />)
    await user.click(combobox('Language'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    rerender(<SelectMenu label="Language" options={LANGUAGES} defaultValue="en" disabled />)
    await closed()
    const trigger = combobox('Language')
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveTextContent('English')
    await user.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('has nothing axe finds wrong, closed and open', async () => {
    const user = userEvent.setup()
    render(
      <>
        <SelectMenu label="Plan" options={PLANS} defaultValue="team" />
        <SelectMenu label="Language of the emails" options={LANGUAGES} error="Choose the language the customer reads" />
        <SelectMenu label="Language of the account" options={LANGUAGES} defaultValue="en" disabled />
        <SelectMenu aria-label="Month" options={MONTHS} />
      </>,
    )
    await expectAccessible(document.body)

    await user.click(combobox('Plan'))
    await user.keyboard('{ArrowUp}')
    expect(activeOf(combobox('Plan'))).toMatch(/^Solo/)
    await expectAccessible(document.body)
  })
})
