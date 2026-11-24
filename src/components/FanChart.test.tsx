import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { FanChart } from './FanChart.js'

// Where a simulation's paths went after each step, and what happened over the first twelve.
const CONE = Array.from({ length: 20 }, (_, index) => {
  const step = index + 1
  return {
    x: step,
    p5: -2 * Math.sqrt(step),
    p25: -0.8 * Math.sqrt(step),
    median: 0.3 * step,
    p75: 0.8 * Math.sqrt(step) + 0.3 * step,
    p95: 2 * Math.sqrt(step) + 0.3 * step,
    actual: step <= 12 ? -0.5 * step : null,
  }
})

const BANDS = [
  { lower: 'p5', upper: 'p95', label: '90 % of the paths' },
  { lower: 'p25', upper: 'p75', label: 'Half of the paths' },
]
const LINES = [
  { key: 'median', label: 'Expected', dashed: true },
  { key: 'actual', label: 'Actual' },
]

describe('FanChart', () => {
  it('fills each band between its edges and draws the lines over them, the actual one as far as it goes', () => {
    const { container } = render(<FanChart data={CONE} bands={BANDS} lines={LINES} animated={false} />)

    const bands = container.querySelectorAll('path[data-band]')
    expect(Array.from(bands).map((band) => band.getAttribute('data-band'))).toEqual(['90 % of the paths', 'Half of the paths'])
    expect(bands[0].getAttribute('fill')).toBe('var(--chart-muted)')
    // A band's outline: forward along its upper edge, back along its lower one, closed.
    expect(bands[0].getAttribute('d')).toMatch(/^M[\d.]+ [\d.]+(L[\d.]+ [\d.]+){39}Z$/)
    expect(container.querySelector('path[data-line="median"]')?.getAttribute('stroke-dasharray')).toBe('5 4')
    expect(container.querySelector('path[data-line="actual"]')).toBeInTheDocument()
  })

  it('counts its x axis in numbers, not times, and says what it counts', () => {
    const { container } = render(
      <FanChart data={CONE} bands={BANDS} lines={LINES} xLabel="Trades" formatX={(x) => `Trade ${x}`} formatXTick={String} animated={false} />,
    )
    const texts = Array.from(container.querySelectorAll('svg text')).map((text) => text.textContent)
    expect(texts).toContain('Trades')
    expect(texts).toEqual(expect.arrayContaining(['5', '10', '15', '20']))
  })

  it('gives screen readers each place as a row, a band as its range, nothing as a dash', () => {
    render(
      <FanChart aria-label="Result against its reference" data={CONE} bands={BANDS} lines={LINES} xLabel="Trades"
        formatX={(x) => `Trade ${x}`} formatValue={(value) => value.toFixed(1)} animated={false} />,
    )
    const table = screen.getByRole('table', { name: 'Result against its reference' })
    expect(within(table).getAllByRole('row')).toHaveLength(CONE.length + 1)
    expect(within(table).getByRole('columnheader', { name: 'Trades' })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /^Trade 4 1\.2 -2\.0 -4\.0 to 5\.2 -1\.6 to 2\.8$/ })).toBeInTheDocument()
    expect(within(table).getByRole('row', { name: /^Trade 20 6\.0 — / })).toBeInTheDocument()
  })

  it('reads a place with the keyboard: each line and each band there', async () => {
    const user = userEvent.setup()
    render(<FanChart aria-label="Result" data={CONE} bands={BANDS} lines={LINES} formatX={(x) => `Trade ${x}`} animated={false} />)

    await user.tab()
    expect(screen.getByRole('img', { name: 'Result' })).toHaveFocus()
    await user.keyboard('{Home}')
    const tooltip = document.querySelector('.glass-float') as HTMLElement
    expect(tooltip).toHaveTextContent('Trade 1')
    expect(tooltip).toHaveTextContent('Actual')
    expect(tooltip).toHaveTextContent('90 % of the paths')
    await user.keyboard('{End}')
    expect(document.querySelector('.glass-float')).toHaveTextContent('Trade 20')
  })

  it('shows and hides a line or a band from its legend, keeping one shown', async () => {
    const user = userEvent.setup()
    const { container } = render(<FanChart data={CONE} bands={BANDS} lines={LINES} animated={false} />)

    await user.click(screen.getByRole('button', { name: /90 % of the paths/ }))
    expect(container.querySelectorAll('path[data-band]')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /Actual/ }))
    expect(container.querySelector('path[data-line="actual"]')).not.toBeInTheDocument()
  })

  it('marks its references in their tone and its places across', () => {
    const { container } = render(
      <FanChart data={CONE} bands={BANDS} lines={LINES} references={[{ value: 0, label: 'Even', tone: 'warning' }]}
        markers={[{ x: 8, label: 'Resumed' }]} animated={false} />,
    )
    expect(container.querySelector('line[stroke="var(--warning)"]')).toBeInTheDocument()
    expect(container).toHaveTextContent('Even')
    expect(container).toHaveTextContent('Resumed')
  })

  it('says so when it has nothing to draw', () => {
    render(<FanChart data={[]} bands={BANDS} lines={LINES} />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })
})
