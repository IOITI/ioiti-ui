import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CopyChip } from './CopyChip.js'
import { LineChart } from './LineChart.js'
import { Panel } from './Panel.js'
import { SignedValue } from './status.js'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table.js'
import { ActivityHeatmap } from './ui/activity-heatmap.js'
import { AdvancedDataTable } from './ui/advanced-data-table.js'
import type { ColumnDef } from './ui/advanced-data-table.js'
import { AnimatedTabs } from './ui/animated-tabs.js'
import { BarChart } from './ui/bar-chart.js'
import { DonutChart } from './ui/donut-chart.js'
import { FunnelChart } from './ui/funnel-chart.js'
import { LiveLineChart } from './ui/live-line-chart.js'
import { StatCard } from './ui/stat-card.js'

// On a phone, one part wider than its place made the whole page scroll sideways, onto nothing or onto a chart
// drawn past its card. jsdom lays nothing out: these read the CSS that keeps each part to its place, which a
// browser was seen to do at 320 to 1,280 px.

const START = Date.UTC(2026, 9, 1)
const POINTS = Array.from({ length: 6 }, (_, index) => ({ t: START + index * 86_400_000, balance: 1000 + index * 9 }))
const DAYS = [
  { label: 'Mon', profit: 120 },
  { label: 'Tue', profit: -80 },
]
const SEGMENTS = [
  { label: 'Shop', value: 420 },
  { label: 'Phone', value: 180 },
]
const STAGES = [
  { label: 'Visited', value: 1200 },
  { label: 'Paid', value: 64 },
]

interface Row {
  id: string
  name: string
  kind: string
}
const ROWS: Row[] = [
  { id: 'r1', name: 'First', kind: 'even' },
  { id: 'r2', name: 'Second', kind: 'odd' },
]
const COLUMNS: ColumnDef<Row>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'kind', header: 'Kind', accessorKey: 'kind', filterable: true, filterOptions: [{ label: 'Even', value: 'even' }, { label: 'Odd', value: 'odd' }] },
]

describe('on a narrow screen, no part is wider than its place', () => {
  it('a chart takes its width from its container, never from what it drew before it was measured', () => {
    const charts = [
      <LineChart key="line" data={POINTS} series={[{ key: 'balance', label: 'Balance' }]} animated={false} />,
      <BarChart key="bar" data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} />,
      <DonutChart key="donut" data={SEGMENTS} animated={false} />,
      <FunnelChart key="funnel" stages={STAGES} />,
      <ActivityHeatmap key="heatmap" data={[{ date: '2026-10-01', value: 3 }]} />,
      <LiveLineChart key="live" initial={[1, 2, 3]} />,
    ]
    for (const chart of charts) {
      const { container, unmount } = render(chart)
      // Drawn first 640 px wide (`useElementWidth`'s first value), in a grid's single column on a phone, a
      // chart held its column open at that width, was measured so and stayed so.
      expect(container.firstElementChild).toHaveClass('w-full', 'contain-inline-size')
      unmount()
    }

    const { container } = render(<StatCard label="Day profit and loss" value={4.2} trend={[1, -2, 4.2]} />)
    expect(container.querySelector('svg')?.parentElement).toHaveClass('contain-inline-size')
  })

  it("keeps a chart's table for screen readers in a box of its own: a table is never narrower than its rows", () => {
    render(
      <>
        <LineChart ariaLabel="Balance" data={POINTS} series={[{ key: 'balance', label: 'Balance' }]} animated={false} />
        <BarChart ariaLabel="Profit by day" data={DAYS} series={[{ key: 'profit', label: 'Profit' }]} animated={false} />
        <DonutChart ariaLabel="Orders by channel" data={SEGMENTS} animated={false} />
        <FunnelChart ariaLabel="Visits" stages={STAGES} />
      </>,
    )

    for (const name of ['Balance', 'Profit by day', 'Orders by channel', 'Visits']) {
      const table = screen.getByRole('table', { name })
      // Made 1 px wide itself, the table stood as wide as its text, beyond the page.
      expect(table).not.toHaveClass('sr-only')
      expect(table.parentElement).toHaveClass('sr-only')
    }
  })

  it('a panel is never wider than its column, whatever it holds', () => {
    render(
      <Panel title="Services">
        <p className="truncate">A detail too long to fit the width of a phone, cut short rather than widening the page</p>
      </Panel>,
    )

    expect(screen.getByRole('heading', { name: 'Services' }).closest('section')).toHaveClass('min-w-0')
  })

  it('a table scrolls sideways in its own frame, which holds its text for screen readers', () => {
    render(
      <Table aria-label="Orders" className="min-w-[40rem]">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>
              <span className="sr-only">Actions</span>
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1042</TableCell>
            <TableCell>Cancel</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    // A frame that is not positioned let the text placed absolutely (sr-only) stand out of it, past the page.
    expect(screen.getByRole('table', { name: 'Orders' }).parentElement).toHaveClass('relative', 'overflow-x-auto')
  })

  it("the data table's table and its filters scroll in frames that hold their text for screen readers", () => {
    render(<AdvancedDataTable title="Rows" data={ROWS} columns={COLUMNS} getRowId={(row) => row.id} selectable={false} />)

    expect(screen.getByRole('table').parentElement).toHaveClass('relative', 'overflow-x-auto')
    expect(screen.getByRole('group', { name: 'Filters' }).parentElement).toHaveClass('relative', 'overflow-x-auto')
  })

  it('a row of tabs that does not fit scrolls in itself, each name on one line', () => {
    render(
      <AnimatedTabs
        label="Views of the asset"
        tabs={['Chart', 'Statistics', 'Data quality', 'Trades', 'Details'].map((label) => ({ id: label, label, content: <p>{label}</p> }))}
      />,
    )

    expect(screen.getByRole('tablist', { name: 'Views of the asset' })).toHaveClass(
      'relative',
      'max-w-full',
      'overflow-x-auto',
      'whitespace-nowrap',
    )
  })

  it('a rolling value keeps its text for screen readers with it', () => {
    render(<SignedValue value={12.4} kind="money" animate />)

    expect(screen.getByText('+€12.40').parentElement).toHaveClass('relative')
  })

  it('a value cut at its end is cut to its chip, the hint around it giving way', () => {
    const address = 'https://example.com/webhooks/orders/2026/10/received?source=shop&order=IT-1042'
    const { container } = render(<CopyChip value={address} label="the address" truncate="end" />)

    const text = container.querySelector('.truncate') as HTMLElement
    expect(text).toHaveTextContent(address)
    expect(text).toHaveClass('min-w-0')
    // The span that takes the focus for the hint: it held the text at its whole width.
    expect(text.parentElement).toHaveAttribute('tabindex', '0')
    expect(text.parentElement).toHaveClass('min-w-0')
  })
})
