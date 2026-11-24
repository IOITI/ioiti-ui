import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { Field } from './Field.js'
import { Hint } from './Hint.js'
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage, Input, Select, Textarea } from './ui/form.js'

describe('a form laid out from its parts', () => {
  it('names each control by its FormLabel, without an id given to both', async () => {
    const { container } = render(
      <Form aria-label="Delivery">
        <FormItem>
          <FormLabel>Contact</FormLabel>
          <FormControl>
            <Input type="email" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Window</FormLabel>
          <FormControl>
            <Select options={[{ value: 'morning', label: 'Morning' }]} />
          </FormControl>
        </FormItem>
        {/* Without FormControl, and beside a button in a row of its own. */}
        <FormItem>
          <FormLabel>Note</FormLabel>
          <div className="flex gap-2">
            <Textarea />
            <button type="button">Clear</button>
          </div>
        </FormItem>
        {/* A control from elsewhere, which reads nothing: FormControl gives it the item's id. */}
        <FormItem>
          <FormLabel>Reference</FormLabel>
          <FormControl>
            <input />
          </FormControl>
        </FormItem>
      </Form>,
    )

    expect(screen.getByLabelText('Contact')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Window').tagName).toBe('SELECT')
    expect(screen.getByLabelText('Note').tagName).toBe('TEXTAREA')
    expect(screen.getByLabelText('Reference').tagName).toBe('INPUT')
    // The row holding the Textarea is given nothing.
    expect(screen.getByLabelText('Note').parentElement).not.toHaveAttribute('id')
    await expectAccessible(container)
  })

  it('names a control by the id it is given, and leaves a label around its own control as it is', async () => {
    const { container } = render(
      <>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input id="contact-email" />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="contact-phone">Phone</FormLabel>
          <FormControl>
            <Input id="contact-phone" type="tel" />
          </FormControl>
        </FormItem>
        {/* FormControl gives the Hint the item's id, which a Hint hands to no one: the Input's own is named. */}
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <Hint content="In euros, cents after a point" className="flex w-full">
              <Input id="contact-amount" />
            </Hint>
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>
            <input type="checkbox" /> Remember this device
          </FormLabel>
        </FormItem>
      </>,
    )

    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'contact-email')
    expect(screen.getByLabelText('Phone')).toHaveAttribute('id', 'contact-phone')
    expect(screen.getByLabelText('Amount')).toHaveAttribute('id', 'contact-amount')
    expect(screen.getByRole('checkbox', { name: 'Remember this device' })).toBeInTheDocument()
    expect(screen.getByText('Remember this device', { exact: false })).not.toHaveAttribute('for')
    await expectAccessible(container)
  })

  it('reads its description and its message with its control, which the message marks invalid while it is there', async () => {
    function Contact() {
      const [error, setError] = useState<string | null>('An address with its domain: ana@example.com')
      return (
        <Form aria-label="Contact">
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input type="email" defaultValue="ana@example" />
            </FormControl>
            <FormDescription>Where the answer goes</FormDescription>
            <FormMessage error={error} />
          </FormItem>
          <button type="button" onClick={() => setError(null)}>
            Put it right
          </button>
        </Form>
      )
    }
    const user = userEvent.setup()
    const { container } = render(<Contact />)

    // Named without its star, which is drawn for the eye.
    const email = screen.getByRole('textbox', { name: 'Email' })
    expect(email).toHaveAccessibleDescription('Where the answer goes An address with its domain: ana@example.com')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    // Announced as it comes, as before.
    expect(screen.getByRole('alert')).toHaveTextContent('An address with its domain: ana@example.com')
    await expectAccessible(container)

    await user.click(screen.getByRole('button', { name: 'Put it right' }))
    expect(email).toHaveAccessibleDescription('Where the answer goes')
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('reads every message under its control, each by an id of its own', async () => {
    const { container } = render(
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" />
        </FormControl>
        <FormMessage error="Twelve characters at least" />
        <FormMessage error="Refused by the server: used before" />
      </FormItem>,
    )

    const [first, second] = screen.getAllByRole('alert')
    expect(first.id).not.toBe(second.id)
    expect(screen.getByLabelText('Password')).toHaveAccessibleDescription('Twelve characters at least Refused by the server: used before')
    await expectAccessible(container)
  })

  it('marks its control invalid by its own error, and keeps that off its element', () => {
    const { container } = render(
      <FormItem error="Say who is writing">
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input />
        </FormControl>
      </FormItem>,
    )

    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(container.querySelector('[error]')).toBeNull()
  })

  it('keeps the ids it was given, each once: a control already described by its message', () => {
    render(
      <FormItem>
        <FormLabel htmlFor="parts-email">Email</FormLabel>
        <FormControl>
          <Input id="parts-email" error aria-invalid aria-describedby="parts-email-error" />
        </FormControl>
        <FormMessage id="parts-email-error" error="An address needs a domain: ana@example.com" />
      </FormItem>,
    )

    const email = screen.getByLabelText('Email')
    expect(email).toHaveAttribute('id', 'parts-email')
    expect(email).toHaveAttribute('aria-describedby', 'parts-email-error')
    expect(email).toHaveAccessibleDescription('An address needs a domain: ana@example.com')
  })

  it('gives a control inside both a Field and a FormItem one id, and each of their descriptions once', async () => {
    const { container } = render(
      <FormItem>
        <FormLabel>Seats</FormLabel>
        <Field label="How many" description="For this order">
          <Input inputMode="numeric" />
        </Field>
        <FormDescription>Up to 99</FormDescription>
        <FormMessage error="A whole number" />
      </FormItem>,
    )

    const seats = screen.getByLabelText('Seats')
    expect(screen.getByLabelText('How many')).toBe(seats)
    expect(container.querySelectorAll(`[id="${seats.id}"]`)).toHaveLength(1)
    const ids = seats.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids).toHaveLength(3)
    expect(new Set(ids).size).toBe(3)
    expect(seats).toHaveAccessibleDescription('Up to 99 A whole number For this order')
    expect(seats).toHaveAttribute('aria-invalid', 'true')
    await expectAccessible(container)
  })
})
