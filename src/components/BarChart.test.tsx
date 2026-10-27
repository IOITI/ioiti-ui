import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { BarChart } from './ui/bar-chart.js'

const DAYS = [
  { label: 'Mon', profit: 120, fees: 12 },
  { label: 'Tue', profit: -80, fees: 9 },
  { label: 'Wed', profit: 45, fees: 11 },
]

const fills = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('svg path')).map((path) => path.getAttribute('fill'))

describe('BarChart', () => {
  it('gives screen readers its figures as a table, losses with their sign', () => {
    render(<BarChart ariaLabel="Profit by day" data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} />)

    const table = screen.getByRole('table', { name: 'Profit by day' })
    expect(within(table).getByRole('row', { name: 'Tue -80' })).toBeInTheDocument()
  })

  it('draws an axis below zero for losses', () => {
    const { container } = render(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} />)
    const ticks = Array.from(container.querySelectorAll('svg text')).map((text) => text.textContent)
    expect(ticks).toContain('0')
    expect(ticks.some((tick) => tick?.startsWith('-'))).toBe(true)
  })

  it('colours one series in the series colour, things compared in the compare colours', () => {
    const { container, rerender } = render(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} />)
    expect(new Set(fills(container))).toEqual(new Set(['var(--chart-series)']))

    rerender(
      <BarChart
        data={DAYS}
        series={[
          { key: 'profit', label: 'Profit' },
          { key: 'fees', label: 'Fees' },
        ]}
        animated={false}
      />,
    )
    expect(new Set(fills(container))).toEqual(new Set(['var(--chart-compare-1)', 'var(--chart-compare-2)']))
  })

  it('colours each bar by its sign, for gains and losses', () => {
    const { container } = render(<BarChart data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} tone="sign" animated={false} />)
    expect(fills(container)).toEqual(['var(--chart-positive)', 'var(--chart-negative)', 'var(--chart-positive)'])
  })

  it('shows a category with the arrow keys, and hides a series from its legend, never the last', async () => {
    const user = userEvent.setup()
    render(
      <BarChart
        ariaLabel="Profit and fees"
        data={DAYS}
        series={[
          { key: 'profit', label: 'Profit' },
          { key: 'fees', label: 'Fees' },
        ]}
        animated={false}
      />,
    )

    await user.tab()
    expect(screen.getByRole('img', { name: 'Profit and fees' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(document.body).toHaveTextContent('Mon')

    const profit = screen.getByRole('button', { name: 'Profit' })
    const fees = screen.getByRole('button', { name: 'Fees' })
    await user.click(profit)
    expect(profit).toHaveAttribute('aria-pressed', 'false')
    await user.click(fees)
    expect(fees).toHaveAttribute('aria-pressed', 'true')
  })
})
