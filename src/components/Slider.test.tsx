import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
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

  it('is named by aria-label where its label is not text, its field beside it too', () => {
    render(<Slider label={<b>Risk</b>} aria-label="Risk per trade" defaultValue={2} showInput />)
    expect(screen.getByRole('slider', { name: 'Risk per trade' })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Risk per trade' })).toBeInTheDocument()
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

  it('is named by aria-label where its label is not text, each end with it', () => {
    render(<RangeSlider label={<b>Price</b>} aria-label="Price" />)
    expect(screen.getByRole('slider', { name: 'Price, from' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Price, to' })).toBeInTheDocument()
  })
})

describe('a slider in a locale', () => {
  it('writes its value as the locale writes a number, to its step\'s decimals', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Slider label="Risque par position" defaultValue={1.5} min={0} max={5} step={0.5} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('slider', { name: 'Risque par position' })).toHaveAttribute('aria-valuetext', '1,5')
    expect(screen.getByText('1,5')).toBeInTheDocument()
  })

  it('names the ends of a range, and writes it, in the language given', () => {
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <RangeSlider label="Prix" defaultValue={[1200, 8000]} max={10_000} step={100} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('slider', { name: 'Prix, de' })).toHaveAttribute('aria-valuetext', '1\u202f200')
    expect(screen.getByRole('slider', { name: 'Prix, à' })).toHaveAttribute('aria-valuetext', '8\u202f000')
    // Found with its spaces made plain (as the DOM Testing Library reads text), written with French's narrow ones.
    expect(screen.getByText('1 200 – 8 000').textContent).toBe('1\u202f200 – 8\u202f000')
  })

  it('takes an application\'s own words over English\'s', () => {
    render(
      <IoitiProvider messages={{ numberInput: { rangeFrom: (label: string) => `${label}, lowest`, rangeName: 'Hours' } }}>
        <RangeSlider label={<span>Hours</span>} defaultValue={[9, 17]} max={24} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('slider', { name: 'Hours, lowest' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Hours, to' })).toBeInTheDocument()
  })
})
