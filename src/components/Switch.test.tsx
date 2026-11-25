import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Field } from './Field.js'
import { FormControl, FormDescription, FormItem, FormLabel, Switch } from './ui/form.js'

describe('Switch', () => {
  it('is named by its label and described by its description: a screen reader says which setting it is', async () => {
    const { container } = render(
      <>
        <Switch label="Weekly summary" description="Every Monday, by email" />
        <Switch label="Alerts" defaultChecked />
      </>,
    )

    const summary = screen.getByRole('switch', { name: 'Weekly summary' })
    expect(summary).toHaveAccessibleDescription('Every Monday, by email')
    expect(summary).not.toBeChecked()
    const alerts = screen.getByRole('switch', { name: 'Alerts' })
    expect(alerts).toBeChecked()
    expect(alerts).not.toHaveAttribute('aria-describedby')
    await expectAccessible(container)
  })

  it('turns on from itself or from its words', () => {
    const onChange = vi.fn()
    render(<Switch label="Weekly summary" onChange={onChange} />)

    fireEvent.click(screen.getByText('Weekly summary'))
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).toBeChecked()
    fireEvent.click(screen.getByRole('switch', { name: 'Weekly summary' }))
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).not.toBeChecked()
    expect(onChange.mock.calls).toEqual([[true], [false]])
  })
})

describe('a switch without words of its own', () => {
  it('is named by its aria-label, by what it points to, or by the FormLabel of its FormItem', async () => {
    const { container } = render(
      <>
        <Switch aria-label="Dark mode" />
        <h3 id="sound-heading">Sound on new orders</h3>
        <Switch aria-labelledby="sound-heading" />
        <FormItem>
          <FormLabel>Signed delivery</FormLabel>
          <FormControl>
            <Switch />
          </FormControl>
          <FormDescription>Always, for an order over 1,000 €</FormDescription>
        </FormItem>
        <FormItem>
          <FormLabel>Delivery on Sundays</FormLabel>
          <Switch />
        </FormItem>
      </>,
    )

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Sound on new orders' })).toBeInTheDocument()
    expect(screen.getByLabelText('Signed delivery')).toHaveAccessibleDescription('Always, for an order over 1,000 €')
    expect(screen.getByLabelText('Delivery on Sundays')).toHaveAttribute('role', 'switch')
    await expectAccessible(container)
  })

  it('turns from the FormLabel that names it', async () => {
    const user = userEvent.setup()
    render(
      <FormItem>
        <FormLabel>Signed delivery</FormLabel>
        <FormControl>
          <Switch />
        </FormControl>
      </FormItem>,
    )

    await user.click(screen.getByText('Signed delivery'))
    expect(screen.getByRole('switch', { name: 'Signed delivery' })).toBeChecked()
  })

  it('takes the description and the error of a Field around it, its label naming it and turning it once', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(
      <>
        <Field label="Weekly summary" description="Every Monday, by email" error="On, for the invoices to be sent">
          <Switch onChange={onChange} />
        </Field>
        <Field label="Notify the customer" description="An email when the order leaves">
          <Switch />
        </Field>
      </>,
    )

    const summary = screen.getByRole('switch', { name: 'Weekly summary' })
    expect(summary).toHaveAccessibleDescription('Every Monday, by email On, for the invoices to be sent')
    expect(summary).toHaveAttribute('aria-invalid', 'true')
    // Each id once: the Field gives them as props too, to a control that could not read them.
    expect(summary.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
    const notify = screen.getByRole('switch', { name: 'Notify the customer' })
    expect(notify).toHaveAccessibleDescription('An email when the order leaves')
    expect(notify).not.toHaveAttribute('aria-invalid')
    await expectAccessible(container)

    await user.click(screen.getByText('Weekly summary'))
    expect(summary).toBeChecked()
    expect(onChange.mock.calls).toEqual([[true]])
  })

  it('turns once from its own words in a label around it, which would pass the click on to it again', () => {
    const onChange = vi.fn()
    render(
      <Field label="Notifications">
        <Switch label="Weekly summary" onChange={onChange} />
      </Field>,
    )

    fireEvent.click(screen.getByText('Weekly summary'))
    expect(screen.getByRole('switch', { name: 'Weekly summary' })).toBeChecked()
    expect(onChange.mock.calls).toEqual([[true]])
  })
})

describe('a switch in a form', () => {
  it('is sent with it under its name while on, as a checkbox is; not while off or disabled', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <form aria-label="Settings">
        <Switch label="Weekly summary" name="weekly" defaultChecked />
        <Switch label="Alerts" name="alerts" value="text" />
        <Switch label="Notify the customer" name="notify" />
        <Switch label="Signed delivery" name="signed" defaultChecked disabled />
      </form>,
    )

    const form = screen.getByRole('form', { name: 'Settings' }) as HTMLFormElement
    expect(Object.fromEntries(new FormData(form))).toEqual({ weekly: 'on' })
    await user.click(screen.getByRole('switch', { name: 'Alerts' }))
    await user.click(screen.getByRole('switch', { name: 'Notify the customer' }))
    await user.click(screen.getByRole('switch', { name: 'Weekly summary' }))
    expect(Object.fromEntries(new FormData(form))).toEqual({ alerts: 'text', notify: 'on' })
    await expectAccessible(container)
  })

  it('takes an id, required and a ref to its button, to focus it', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Switch label="I accept the terms" id="terms" required ref={ref} />)

    const terms = screen.getByRole('switch', { name: 'I accept the terms' })
    expect(ref.current).toBe(terms)
    expect(terms).toHaveAttribute('id', 'terms')
    expect(terms).toHaveAttribute('aria-required', 'true')
  })
})
