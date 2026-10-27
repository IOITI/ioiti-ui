import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RangeSlider, Slider } from './Slider.js'

describe('Slider', () => {
  it('is the browser\'s range input, named by its label, its value in words', () => {
    render(<Slider label="Risk per trade" defaultValue={1.5} min={0} max={5} step={0.5} format={(value) => `${value}%`} />)
    const slider = screen.getByRole('slider', { name: 'Risk per trade' })
    expect(slider).toHaveValue('1.5')
    expect(slider).toHaveAttribute('aria-valuetext', '1.5%')
    expect(screen.getByText('1.5%')).toBeInTheDocument()
  })

  it('moves with the keyboard, as the browser moves it', async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(<Slider label="Share" defaultValue={40} onChange={changed} />)
    const slider = screen.getByRole('slider', { name: 'Share' })
    fireEvent.change(slider, { target: { value: '45' } })
    expect(changed).toHaveBeenLastCalledWith(45)
    await user.tab()
    expect(slider).toHaveFocus()
  })

  it('types its value in a field beside it', async () => {
    const user = userEvent.setup()
    render(<Slider label="Delay" defaultValue={30} max={120} showInput />)
    const field = screen.getByRole('spinbutton', { name: 'Delay' })
    await user.clear(field)
    await user.type(field, '90')
    expect(screen.getByRole('slider', { name: 'Delay' })).toHaveValue('90')
  })
})

describe('RangeSlider', () => {
  it('chooses a range, its ends never crossing', () => {
    const changed = vi.fn()
    render(<RangeSlider label="Price" defaultValue={[20, 80]} onChange={changed} format={(value) => `${value} €`} />)
    const from = screen.getByRole('slider', { name: 'Price, from' })
    const to = screen.getByRole('slider', { name: 'Price, to' })
    expect(screen.getByText('20 € – 80 €')).toBeInTheDocument()

    fireEvent.change(from, { target: { value: '90' } })
    expect(changed).toHaveBeenLastCalledWith([80, 80])
    fireEvent.change(to, { target: { value: '60' } })
    expect(changed).toHaveBeenLastCalledWith([80, 80])
    expect(to).toHaveAttribute('aria-valuetext', '80 €')
  })
})
