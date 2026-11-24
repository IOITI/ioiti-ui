import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
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
    const { container } = render(<DonutChart aria-label="Orders by channel" data={CHANNELS} animated={false} />)

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

  it('gives screen readers every segment as a table, those grouped included', async () => {
    const { container } = render(<DonutChart aria-label="Orders by channel" data={CHANNELS} animated={false} />)
    const table = screen.getByRole('table', { name: 'Orders by channel' })
    expect(within(table).getAllByRole('row')).toHaveLength(CHANNELS.length + 1)
    expect(within(table).getByRole('row', { name: 'Post 30 4%' })).toBeInTheDocument()
    await expectAccessible(container)
  })

  it('draws its segments for the eye and the pointer, read once as the table and the legend, the keyboard in the legend', async () => {
    const user = userEvent.setup()
    const { container } = render(<DonutChart aria-label="Orders by channel" data={CHANNELS} animated={false} />)

    // The picture is one image, named; its segments are no names of their own.
    expect(screen.getByRole('img', { name: 'Orders by channel' })).toBeInTheDocument()
    const segments = Array.from(container.querySelectorAll('svg g'))
    expect(segments).toHaveLength(5)
    for (const segment of segments) {
      expect(segment).toHaveAttribute('aria-hidden', 'true')
      expect(segment.querySelector('[aria-label]')).toBeNull()
    }

    // The keyboard reads a segment from its line of the legend, the centre saying its name, figure and share (the
    // legend and the table say "Shop" already).
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getAllByText('Shop')).toHaveLength(2)
    await user.tab()
    expect(screen.getByRole('button', { name: /Shop/ })).toHaveFocus()
    await waitFor(() => expect(screen.getAllByText('Shop')).toHaveLength(3))
    expect(screen.queryByText('Total')).not.toBeInTheDocument()
    await expectAccessible(container)
  })

  it('is read as a gauge without its legend', async () => {
    const { container } = render(
      <DonutChart aria-label="Seats taken" variant="semi" showLegend={false} animated={false} data={[{ label: 'Taken', value: 46 }, { label: 'Free', value: 4 }]} />,
    )
    expect(screen.getByRole('img', { name: 'Seats taken' })).toBeInTheDocument()
    await expectAccessible(container)
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
