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

  it('titles a category in its tooltip and its row, and says more of it', async () => {
    const user = userEvent.setup()
    render(
      <BarChart
        ariaLabel="Profit by day"
        data={DAYS}
        series={[{ key: 'profit', label: 'Profit' }]}
        formatTitle={(datum) => `${datum.label}day`}
        details={(datum) => [{ label: 'Fees', value: String(datum.fees) }]}
        animated={false}
      />,
    )

    const table = screen.getByRole('table', { name: 'Profit by day' })
    expect(within(table).getByRole('row', { name: 'Tueday -80 Fees 9' })).toBeInTheDocument()
    await user.tab()
    await user.keyboard('{Home}')
    const tooltip = document.querySelector('.glass-float') as HTMLElement
    expect(tooltip).toHaveTextContent('Monday')
    expect(tooltip).toHaveTextContent('Fees12')
  })

  it('names the categories asked for, and counts in whole numbers', () => {
    const counts = [
      { label: '09:00', runs: 1 },
      { label: '09:10', runs: 2 },
      { label: '09:20', runs: 0 },
    ]
    const { container } = render(
      <BarChart data={counts} series={[{ key: 'runs', label: 'Runs' }]} tickAt={(_, index) => index !== 1} integer animated={false} />,
    )
    const texts = Array.from(container.querySelectorAll('svg text')).map((text) => text.textContent)
    expect(texts).toContain('09:00')
    expect(texts).toContain('09:20')
    expect(texts).not.toContain('09:10')
    expect(texts.filter((text) => text?.includes('.'))).toEqual([])
  })

  it('sets one category apart: its bar in the series colour, a line through it named, the others grey', () => {
    const bins = [
      { label: '-2%', runs: 3 },
      { label: '0%', runs: 8 },
      { label: '2%', runs: 4 },
    ]
    const { container } = render(
      <BarChart data={bins} series={[{ key: 'runs', label: 'Runs' }]} marked={{ index: 2, label: 'This run' }} animated={false} />,
    )
    expect(fills(container)).toEqual(['var(--chart-muted)', 'var(--chart-muted)', 'var(--chart-series)'])
    expect(container.querySelector('line[stroke="var(--chart-series)"]')).toBeInTheDocument()
    expect(container).toHaveTextContent('This run')
  })

  it('draws no bar for a missing value, and says it with a dash', () => {
    const slots = [
      { label: '09:00', spread: 0.04 },
      { label: '09:30', spread: null },
    ]
    const { container } = render(
      <BarChart ariaLabel="Spread" data={slots} series={[{ key: 'spread', label: 'Spread' }]} animated={false} />,
    )
    const table = screen.getByRole('table', { name: 'Spread' })
    expect(within(table).getByRole('row', { name: '09:30 —' })).toBeInTheDocument()
    // The second bar has no height: its path is a point on the zero line.
    const paths = Array.from(container.querySelectorAll('svg path')).map((path) => path.getAttribute('d'))
    expect(paths[1]).not.toEqual(paths[0])
  })
})
