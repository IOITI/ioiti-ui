import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
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

  it('leaves what is being typed alone where its caller refuses a value', async () => {
    const user = userEvent.setup()
    // A caller that holds 30 and takes no empty value.
    render(<NumberInput label="Minutes" value={30} onChange={() => {}} />)
    const field = screen.getByRole('spinbutton', { name: 'Minutes' })
    await user.clear(field)
    expect(field).toHaveValue('')
    await user.type(field, '4')
    expect(field).toHaveValue('4')
  })

  it('takes a value that is not a number for none', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<NumberInput label="Amount" value={Number.NaN} onChange={changed} />)
    const field = screen.getByRole('spinbutton', { name: 'Amount' })
    expect(field).toHaveValue('')
    expect(field).not.toHaveAttribute('aria-valuenow')

    field.focus()
    await user.keyboard('{ArrowUp}')
    expect(changed).toHaveBeenLastCalledWith(1)
  })
})

describe('a number typed, as its locale writes one', () => {
  it('reads a separator between groups of three as English groups with it: "1,500" is 1500, "1,5" is 1.5', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <>
        <NumberInput label="Limit" step={0.1} onChange={changed} />
        <button type="button">Next</button>
      </>,
    )
    const field = screen.getByRole('spinbutton', { name: 'Limit' })

    await user.type(field, '1,500')
    expect(field).toHaveValue('1,500')
    expect(changed).toHaveBeenLastCalledWith(1500)
    // Shown back without its groups, as it always was: what is edited next is digits.
    await user.tab()
    expect(field).toHaveValue('1500')

    await user.clear(field)
    await user.type(field, '1,5')
    expect(changed).toHaveBeenLastCalledWith(1.5)
    await user.clear(field)
    await user.type(field, '1,234.5')
    expect(changed).toHaveBeenLastCalledWith(1234.5)
    await user.tab()
    expect(field).toHaveValue('1234.5')
  })

  it('takes a true minus, as the package writes one', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<NumberInput label="Offset" onChange={changed} />)
    await user.type(screen.getByRole('spinbutton', { name: 'Offset' }), '−12.5')
    expect(changed).toHaveBeenLastCalledWith(-12.5)
  })

  it('reads what is typed as French writes a number, and as people type one, and shows it in French', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NumberInput label="Montant" suffix="€" step={0.1} onChange={changed} />
        <button type="button">Suivant</button>
      </IoitiProvider>,
    )
    const field = screen.getByRole('spinbutton', { name: 'Montant' })

    await user.type(field, '1 234,5')
    expect(field).toHaveValue('1 234,5')
    expect(changed).toHaveBeenLastCalledWith(1234.5)
    await user.tab()
    expect(field).toHaveValue('1234,5')
    expect(field).toHaveAttribute('aria-valuenow', '1234.5')
    expect(field).toHaveAttribute('aria-valuetext', '1234,5 €')

    // A comma is French's decimal separator: "1,500" is 1.5 here.
    await user.clear(field)
    await user.type(field, '1,500')
    expect(changed).toHaveBeenLastCalledWith(1.5)
    await user.clear(field)
    await user.type(field, '1,5')
    expect(changed).toHaveBeenLastCalledWith(1.5)
    // A point, as people type one whatever their locale, shown back in French.
    await user.clear(field)
    await user.type(field, '1.5')
    expect(changed).toHaveBeenLastCalledWith(1.5)
    await user.tab()
    expect(field).toHaveValue('1,5')

    // As French writes it, pasted: a narrow no-break space between its groups, a true minus.
    await user.clear(field)
    await user.type(field, '−1\u202f234,5')
    expect(changed).toHaveBeenLastCalledWith(-1234.5)
  })

  it('writes its value in the locale given, and again when the locale changes', () => {
    const { rerender } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NumberInput label="Taux" defaultValue={-2.5} precision={2} />
      </IoitiProvider>,
    )
    const field = screen.getByRole('spinbutton', { name: 'Taux' })
    expect(field).toHaveValue('-2,50')
    rerender(
      <IoitiProvider locale="en-GB">
        <NumberInput label="Taux" defaultValue={-2.5} precision={2} />
      </IoitiProvider>,
    )
    expect(field).toHaveValue('-2.50')
  })

  it('says what its buttons do in the language given', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <NumberInput label="Quantité" defaultValue={2} />
      </IoitiProvider>,
    )
    const [minus] = Array.from(screen.getByRole('spinbutton', { name: 'Quantité' }).parentElement?.querySelectorAll('button') ?? [])
    await user.hover(minus)
    expect(await screen.findByRole('tooltip', { hidden: true })).toHaveTextContent('Diminuer')
  })
})
