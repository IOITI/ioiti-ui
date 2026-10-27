import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DonutChart } from './ui/donut-chart.js'

const CHANNELS = [
  { label: 'Shop', value: 420 },
  { label: 'Phone', value: 180 },
  { label: 'Partners', value: 90 },
  { label: 'Fairs', value: 60 },
  { label: 'Post', value: 30 },
  { label: 'Other sites', value: 20 },
]

const strokes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('svg path[stroke]'))
    .map((path) => path.getAttribute('stroke'))
    .filter((stroke) => stroke !== 'transparent')

describe('DonutChart', () => {
  it('compares four segments in the compare colours, the rest one segment in grey', () => {
    const { container } = render(<DonutChart ariaLabel="Orders by channel" data={CHANNELS} animated={false} />)

    expect(strokes(container)).toEqual([
      'var(--chart-compare-1)',
      'var(--chart-compare-2)',
      'var(--chart-compare-3)',
      'var(--chart-compare-4)',
      'var(--chart-muted)',
    ])
    const legend = screen.getByRole('list', { name: 'Legend' })
    expect(within(legend).getByRole('button', { name: /Other/ })).toBeInTheDocument()
  })

  it('gives screen readers every segment as a table, those grouped included', () => {
    render(<DonutChart ariaLabel="Orders by channel" data={CHANNELS} animated={false} />)
    const table = screen.getByRole('table', { name: 'Orders by channel' })
    expect(within(table).getAllByRole('row')).toHaveLength(CHANNELS.length + 1)
    expect(within(table).getByRole('row', { name: 'Post 30 4%' })).toBeInTheDocument()
  })

  it('hides a segment from its legend, never the last', async () => {
    const user = userEvent.setup()
    render(<DonutChart data={CHANNELS.slice(0, 2)} animated={false} />)

    const shop = screen.getByRole('button', { name: /Shop/ })
    const phone = screen.getByRole('button', { name: /Phone/ })
    await user.click(shop)
    expect(shop).toHaveAttribute('aria-pressed', 'false')
    await user.click(phone)
    expect(phone).toHaveAttribute('aria-pressed', 'true')
  })
})
