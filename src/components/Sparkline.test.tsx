import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Sparkline } from './Sparkline.js'

describe('Sparkline', () => {
  it('says what it shows, from its first value to its last', () => {
    render(<Sparkline label="Orders per day" values={[120, 90, 200, 180]} />)
    expect(screen.getByRole('img', { name: 'Orders per day: from 120 to 180, high 200, low 90' })).toBeInTheDocument()
  })

  it('takes the colour of its direction, or the tone given', () => {
    const { container, rerender } = render(<Sparkline values={[3, 5, 8]} />)
    expect(container.querySelector('path[stroke]')).toHaveAttribute('stroke', 'var(--chart-positive)')

    rerender(<Sparkline values={[3, 5, 8]} tone="negative" />)
    expect(container.querySelector('path[stroke]')).toHaveAttribute('stroke', 'var(--chart-negative)')

    rerender(<Sparkline values={[3, 5, 8]} tone="neutral" />)
    expect(container.querySelector('path[stroke]')).toHaveAttribute('stroke', 'var(--chart-series)')
  })

  it('draws bars from zero, each in the colour of its sign', () => {
    const { container } = render(<Sparkline variant="bars" values={[40, -25, 10]} />)
    const fills = Array.from(container.querySelectorAll('rect')).map((bar) => bar.getAttribute('fill'))
    expect(fills).toEqual(['var(--chart-positive)', 'var(--chart-negative)', 'var(--chart-positive)'])
  })

  it('draws nothing without a value', () => {
    const { container } = render(<Sparkline values={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
