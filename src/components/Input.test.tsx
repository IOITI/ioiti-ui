import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Field } from './Field.js'
import { Input } from './ui/form.js'

describe('Input with its units', () => {
  it('draws a unit before or after the value, and a screen reader hears it with the field', () => {
    render(
      <>
        <Field label="Timeout">
          <Input suffix="ms" defaultValue="250" />
        </Field>
        <Field label="Site">
          <Input prefix="https://" defaultValue="example.com" aria-describedby="site-help" />
        </Field>
        <p id="site-help">Without a path</p>
      </>,
    )
    expect(screen.getByRole('textbox', { name: 'Timeout' })).toHaveAccessibleDescription('ms')
    expect(screen.getByRole('textbox', { name: 'Site' })).toHaveAccessibleDescription('Without a path https://')
  })

  it('is as it was without them', () => {
    render(<Input aria-label="Name" />)
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-describedby')
  })
})
