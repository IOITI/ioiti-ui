import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NumberInput } from './NumberInput.js'

describe('NumberInput', () => {
  it('is a spin button, its value said with its unit', () => {
    render(<NumberInput label="Daily limit" defaultValue={500} min={0} max={1000} suffix="€" />)
    const field = screen.getByRole('spinbutton', { name: 'Daily limit' })
    expect(field).toHaveValue('500')
    expect(field).toHaveAttribute('aria-valuenow', '500')
    expect(field).toHaveAttribute('aria-valuetext', '500 €')
  })

  it('keeps what is typed until it is a number, a comma or a point for the decimals', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<NumberInput label="Rate" onChange={changed} />)
    const field = screen.getByRole('spinbutton', { name: 'Rate' })

    await user.type(field, '1.')
    expect(field).toHaveValue('1.')
    await user.type(field, '5')
    expect(changed).toHaveBeenLastCalledWith(1.5)

    await user.clear(field)
    expect(changed).toHaveBeenLastCalledWith(null)
    await user.type(field, '2,5')
    expect(changed).toHaveBeenLastCalledWith(2.5)
    await user.type(field, 'x')
    expect(field).toHaveValue('2,5')
  })

  it('steps with the arrow keys, ten at a time with Shift, within its bounds', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Quantity" defaultValue={8} min={0} max={20} integer />)
    const field = screen.getByRole('spinbutton', { name: 'Quantity' })
    field.focus()

    await user.keyboard('{ArrowUp}')
    expect(field).toHaveValue('9')
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}')
    expect(field).toHaveValue('19')
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(field).toHaveValue('20')
    await user.keyboard('{Home}')
    expect(field).toHaveValue('0')
  })

  it('keeps to its bounds when it leaves the field, and goes back from what is not a number', async () => {
    const user = userEvent.setup()
    render(
      <>
        <NumberInput label="Limit" defaultValue={500} max={750} />
        <button type="button">Next</button>
      </>,
    )
    const field = screen.getByRole('spinbutton', { name: 'Limit' })

    await user.clear(field)
    await user.type(field, '900')
    await user.tab()
    expect(field).toHaveValue('750')

    await user.clear(field)
    await user.type(field, '-')
    await user.tab()
    expect(field).toHaveValue('')
  })

  it('steps with its buttons, the focus staying in the field', async () => {
    const user = userEvent.setup()
    render(<NumberInput label="Delay" defaultValue={0.5} step={0.25} min={0} />)
    const field = screen.getByRole('spinbutton', { name: 'Delay' })
    const [minus, plus] = Array.from(field.parentElement?.querySelectorAll('button') ?? [])

    await user.click(plus)
    expect(field).toHaveValue('0.75')
    await user.click(minus)
    await user.click(minus)
    await user.click(minus)
    expect(field).toHaveValue('0')
    expect(minus).toBeDisabled()
  })
})
