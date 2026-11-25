import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Field } from './Field.js'
import { Hint } from './Hint.js'
import { MultiSelect } from './MultiSelect.js'
import { NumberInput } from './NumberInput.js'
import { DrawCheckbox as Checkbox } from './ui/draw-checkbox.js'
import { FormControl, FormItem, FormLabel, FormMessage, Input, RadioGroup, Select, Textarea } from './ui/form.js'
import { OTPInput } from './ui/otp-input.js'

/** Its border is the error's alone: none of the classes of its own border is left to win in dark or an accent. */
function hasErrorBorderOnly(element: Element) {
  const classes = element.getAttribute('class') ?? ''
  expect(classes).toContain('border-negative/60')
  expect(classes).not.toContain('dark:border-[#1F1F1F]')
  expect(classes).not.toContain('dark:hover:border-[#4A4A4A]')
  expect(classes).not.toMatch(/accent:focus(-within)?:border-brand/)
  expect(classes).not.toContain('rose-500')
}

describe('a field in error', () => {
  it('is drawn in the error’s colour in every look, and said to be wrong: an Input, a Textarea, a Select', () => {
    render(
      <>
        <Input aria-label="Name" error="Required" />
        <Textarea aria-label="Note" error />
        <Select aria-label="Size" error options={[{ value: 's', label: 'Small' }]} />
      </>,
    )
    for (const field of [screen.getByRole('textbox', { name: 'Name' }), screen.getByRole('textbox', { name: 'Note' }), screen.getByRole('combobox', { name: 'Size' })]) {
      expect(field).toHaveAttribute('aria-invalid', 'true')
      hasErrorBorderOnly(field)
    }
  })

  it('keeps its own border, in the accent in focus, while it is right', () => {
    render(<Input aria-label="Name" />)
    const field = screen.getByRole('textbox', { name: 'Name' })
    expect(field).not.toHaveAttribute('aria-invalid')
    expect(field).toHaveClass('border-border', 'focus:border-muted-foreground')
    expect(field.className).toContain('accent:focus:border-brand')
  })

  it('is in error when a Field around it says so, whatever the control: Input, NumberInput, MultiSelect, OTPInput', () => {
    render(
      <>
        <Field label="Name" error="Required">
          <Input />
        </Field>
        <Field label="Seats" error="1 at least">
          <NumberInput />
        </Field>
        <Field label="Cities" error="Choose one" description="Where it is sold">
          <MultiSelect options={[{ value: 'lyon', label: 'Lyon' }]} />
        </Field>
        <Field label="Code" error="The code has 6 digits">
          <OTPInput />
        </Field>
      </>,
    )
    hasErrorBorderOnly(screen.getByRole('textbox', { name: 'Name' }))
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveAccessibleDescription('1 at least')
    const cities = screen.getByRole('combobox', { name: 'Cities' })
    expect(cities).toHaveAttribute('aria-invalid', 'true')
    expect(cities).toHaveAccessibleDescription('Where it is sold Choose one')
    hasErrorBorderOnly(cities.parentElement!)
    // Named by its Field's label, over the provider's words.
    const code = screen.getByRole('group', { name: 'Code' })
    expect(code).toHaveAccessibleDescription('The code has 6 digits')
    for (const box of within(code).getAllByRole('textbox')) {
      expect(box).toHaveAttribute('aria-invalid', 'true')
      hasErrorBorderOnly(box)
    }
  })

  it('is in error when its FormItem says so, by a message under it or its own error: an Input, a Textarea, a Select', async () => {
    const { container } = render(
      <>
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input />
          </FormControl>
          <FormMessage error="Say who is writing" />
        </FormItem>
        <FormItem error="Twenty characters at least">
          <FormLabel>Note</FormLabel>
          <FormControl>
            <Textarea />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Size</FormLabel>
          <FormControl>
            <Select options={[{ value: 's', label: 'Small' }]} />
          </FormControl>
          <FormMessage>Choose a size</FormMessage>
        </FormItem>
      </>,
    )
    for (const field of [screen.getByRole('textbox', { name: 'Name' }), screen.getByRole('textbox', { name: 'Note' }), screen.getByRole('combobox', { name: 'Size' })]) {
      expect(field).toHaveAttribute('aria-invalid', 'true')
      hasErrorBorderOnly(field)
    }
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAccessibleDescription('Say who is writing')
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveAccessibleDescription('Choose a size')
    await expectAccessible(container)
  })

  it('is in error, and described, through a Hint between it and its Field', async () => {
    const { container } = render(
      <Field label="Amount" description="In euros" error="Cents after a point: 120.00">
        <Hint content="Set by the contract" className="flex w-full">
          <Input defaultValue="120,00" />
        </Hint>
      </Field>,
    )
    const amount = screen.getByRole('textbox', { name: 'Amount' })
    expect(amount).toHaveAttribute('aria-invalid', 'true')
    hasErrorBorderOnly(amount)
    expect(amount).toHaveAccessibleDescription('Set by the contract In euros Cents after a point: 120.00')
    await expectAccessible(container)
  })

  it('is a checkbox to tick: its empty box in the error’s colour, said to be wrong', () => {
    render(<Checkbox label="I accept the terms" error />)
    const box = screen.getByRole('checkbox', { name: 'I accept the terms' })
    expect(box).toHaveAttribute('aria-invalid', 'true')
    expect(box.nextElementSibling).toHaveClass('border-negative')
  })
})

describe('a group of radios', () => {
  it('is named by what it is asked, and each radio takes the design’s focus ring where it is seen', () => {
    render(
      <RadioGroup
        name="plan"
        aria-label="Plan"
        options={[
          { value: 'free', label: 'Free' },
          { value: 'team', label: 'Team' },
        ]}
      />,
    )
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument()
    // Lying over its circle, not hidden: the global ring is drawn around it.
    expect(screen.getByRole('radio', { name: 'Free' })).not.toHaveClass('sr-only')
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveClass('absolute', 'inset-0')
  })

  it('is named by a heading it points to', () => {
    render(
      <>
        <h3 id="plan-heading">Your plan</h3>
        <RadioGroup name="plan" aria-labelledby="plan-heading" options={[{ value: 'free', label: 'Free' }]} />
      </>,
    )
    expect(screen.getByRole('radiogroup', { name: 'Your plan' })).toBeInTheDocument()
  })
})

describe('a hint around a disabled control', () => {
  it('grows with a wrapper that does, so that a full-width field keeps its width', () => {
    render(
      <Hint content="Locked by an administrator" wrap className="flex w-full">
        <Input aria-label="Domain" disabled />
      </Hint>,
    )
    const field = screen.getByRole('textbox', { name: 'Domain' })
    expect(field.closest('span[tabindex="0"]')).toHaveClass('grow')
  })
})

describe('a MultiSelect with a maximum', () => {
  it('takes no more than it, and says why', async () => {
    const user = userEvent.setup()
    render(
      <MultiSelect
        label="Cities"
        max={2}
        defaultValue={['lyon', 'paris']}
        options={[
          { value: 'lyon', label: 'Lyon' },
          { value: 'paris', label: 'Paris' },
          { value: 'rome', label: 'Rome' },
        ]}
      />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Cities' }))
    const list = screen.getByRole('listbox', { name: 'Cities' })
    expect(within(list).getByRole('option', { name: 'Rome' })).toHaveAttribute('aria-disabled', 'true')
    expect(within(list).getByRole('option', { name: 'Paris' })).not.toHaveAttribute('aria-disabled')
    // Why, beside the list: the option it keeps from being chosen is described by it (no live region drawn with its words).
    expect(within(list).getByRole('option', { name: 'Rome' })).toHaveAccessibleDescription(expect.stringContaining('2 at most'))

    await user.click(within(list).getByRole('option', { name: 'Rome' }))
    expect(screen.queryByRole('button', { name: 'Remove Rome' })).not.toBeInTheDocument()

    // One removed, another can be chosen.
    await user.click(within(list).getByRole('option', { name: 'Paris' }))
    expect(within(list).getByRole('option', { name: 'Rome' })).not.toHaveAttribute('aria-disabled')
  })
})
