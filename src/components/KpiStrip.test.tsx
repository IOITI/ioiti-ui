import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KpiStrip } from './KpiStrip.js'

const ITEMS = [
  { label: 'Orders', value: '1,284', change: 4.2 },
  { label: 'Refunds', value: '12', change: 3, goodWhen: 'down' as const },
  { label: 'Basket', value: '€48.10', hint: 'average' },
]

describe('a strip of figures', () => {
  it('lists each figure with its change in the tone of what it means', () => {
    const { container } = render(<KpiStrip items={ITEMS} title="Shop" period="Compared with yesterday" />)
    const list = container.querySelector('dl')!
    expect(list).toHaveAccessibleDescription('Compared with yesterday')
    expect(within(list).getByText('Orders').tagName).toBe('DT')
    expect(screen.getByText('+4.2%').parentElement).toHaveClass('text-positive')
    expect(screen.getByText('+3.0%').parentElement).toHaveClass('text-negative')
    expect(screen.getByText('up 3.0%')).toHaveClass('sr-only')
    expect(screen.getByText('average')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Shop' })).toBeInTheDocument()
  })

  it('wraps to fewer columns on a narrower screen, its hairlines drawn by each figure and cut at the frame', () => {
    const { container } = render(<KpiStrip items={[...ITEMS, { label: 'Visits', value: '9,120' }, { label: 'Carts', value: '311' }]} />)
    const list = container.querySelector('dl')!
    expect(list).toHaveClass('grid', 'grid-cols-2', 'sm:grid-cols-3', 'lg:grid-cols-5', '-mt-px', '-ml-px')
    expect(list.parentElement).toHaveClass('overflow-hidden')
    expect(list.firstElementChild).toHaveClass('border-t', 'border-l')
    expect(container.firstElementChild).toHaveClass('glass-card', 'glass-edge')
  })

  it('takes the columns asked', () => {
    const { container } = render(<KpiStrip items={ITEMS} columns={4} />)
    expect(container.querySelector('dl')).toHaveClass('lg:grid-cols-4')
  })
})
