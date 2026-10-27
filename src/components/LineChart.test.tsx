import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { LineChart } from './LineChart.js'

const DAY = 86_400_000
const START = Date.UTC(2026, 9, 1)

const RUNS = Array.from({ length: 10 }, (_, index) => ({
  t: START + index * DAY,
  a: 1000 + index * 12,
  b: index === 4 ? null : 1000 + index * 7,
}))

const SERIES = [
  { key: 'a', label: 'Run 41' },
  { key: 'b', label: 'Run 42' },
]

const strokes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('svg path[stroke]')).map((path) => path.getAttribute('stroke'))

describe('LineChart', () => {
  it('gives screen readers every point as a table, a gap as a dash', () => {
    render(<LineChart ariaLabel="Balance of two runs" data={RUNS} series={SERIES} animated={false} />)
    const table = screen.getByRole('table', { name: 'Balance of two runs' })
    expect(within(table).getAllByRole('row')).toHaveLength(RUNS.length + 1)
    expect(within(table).getByRole('row', { name: '5 Oct 2026 1,048 —' })).toBeInTheDocument()
  })

  it('compares series in the compare colours, a gap splitting a line in two', () => {
    const { container } = render(<LineChart data={RUNS} series={SERIES} animated={false} />)
    expect(strokes(container)).toEqual(['var(--chart-compare-1)', 'var(--chart-compare-2)', 'var(--chart-compare-2)'])
  })

  it('draws one series in the series colour, an area under it, and its limits in their tone', () => {
    const { container } = render(
      <LineChart
        data={RUNS}
        series={[{ key: 'a', label: 'Balance' }]}
        area
        references={[{ value: 1100, label: 'Limit', tone: 'negative' }]}
        animated={false}
      />,
    )
    expect(strokes(container)).toContain('var(--chart-series)')
    expect(container.querySelector('path[fill^="url("]')).toBeInTheDocument()
    expect(container.querySelector('line[stroke="var(--chart-negative)"]')).toBeInTheDocument()
    expect(container).toHaveTextContent('Limit')
  })

  it('reads its points with the keyboard', async () => {
    const user = userEvent.setup()
    render(<LineChart ariaLabel="Balance" data={RUNS} series={SERIES} animated={false} />)

    await user.tab()
    expect(screen.getByRole('img', { name: 'Balance' })).toHaveFocus()
    await user.keyboard('{End}')
    const tooltip = document.querySelector('.glass-float') as HTMLElement
    expect(tooltip).toHaveTextContent('10 Oct 2026')
    expect(tooltip).toHaveTextContent('1,108')
    await user.keyboard('{Home}')
    expect(tooltip).toHaveTextContent('1 Oct 2026')
  })

  it('hides a series from its legend, never the last', async () => {
    const user = userEvent.setup()
    const { container } = render(<LineChart data={RUNS} series={SERIES} animated={false} />)

    await user.click(screen.getByRole('button', { name: 'Run 42' }))
    expect(strokes(container)).toEqual(['var(--chart-compare-1)'])
    await user.click(screen.getByRole('button', { name: 'Run 41' }))
    expect(screen.getByRole('button', { name: 'Run 41' })).toHaveAttribute('aria-pressed', 'true')
  })
})
