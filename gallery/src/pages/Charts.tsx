import {
  ActivityHeatmap,
  BarChart,
  ChartLegend,
  DependencyTrace,
  formatMoney,
  formatPercent,
  FunnelChart,
  KpiGrid,
  KpiTile,
  LiveLineChart,
  PageHeader,
  SegmentedControl,
  Sparkline,
} from 'ioiti-ui'
import type { HeatDay } from 'ioiti-ui'
import { useMemo, useState } from 'react'

import { Demo } from '../parts'

const DAY = 86_400_000

/** Numbers that look random and are the same at every load. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const GAIN_LOSS = {
  positive: ['var(--chart-gain-1)', 'var(--chart-gain-2)', 'var(--chart-gain-3)', 'var(--chart-gain-4)'],
  negative: ['var(--chart-loss-1)', 'var(--chart-loss-2)', 'var(--chart-loss-3)', 'var(--chart-loss-4)'],
}

function days(): HeatDay[] {
  const random = seeded(7)
  const end = new Date(Date.UTC(2026, 9, 23))
  const out: HeatDay[] = []
  for (let back = 140; back >= 0; back -= 1) {
    const date = new Date(end.getTime() - back * DAY)
    const weekday = date.getUTCDay()
    if (weekday === 0 || weekday === 6) continue
    out.push({ date: date.toISOString().slice(0, 10), value: Math.round((random() - 0.45) * 800) / 10, detail: `${1 + Math.floor(random() * 6)} sales` })
  }
  return out
}

function hours(): (number | null)[][] {
  const random = seeded(11)
  return Array.from({ length: 5 }, () => Array.from({ length: 9 }, (_, hour) => (hour === 4 ? null : Math.round(random() * 40))))
}

/** A value that wanders, a reading a second. */
function wander(push: (value: number) => void) {
  let value = 50
  const timer = window.setInterval(() => {
    value = Math.max(0, value + (Math.random() - 0.5) * 6)
    push(Math.round(value * 10) / 10)
  }, 1000)
  return () => window.clearInterval(timer)
}

const RUNS = [
  { label: 'Run 41', color: 'var(--chart-compare-1)', shape: 'line' as const, value: '+4.2%' },
  { label: 'Run 42', color: 'var(--chart-compare-2)', shape: 'line' as const, value: '+1.8%' },
  { label: 'Benchmark', color: 'var(--chart-muted)', shape: 'dashed' as const, value: '+0.9%' },
  { label: 'Trades', color: 'var(--chart-compare-3)', shape: 'dot' as const },
]

const MONTHS = [
  { label: 'May', shop: 420, phone: 180, partners: 90 },
  { label: 'Jun', shop: 460, phone: 160, partners: 120 },
  { label: 'Jul', shop: 380, phone: 140, partners: 150 },
  { label: 'Aug', shop: 300, phone: 120, partners: 110 },
  { label: 'Sep', shop: 510, phone: 200, partners: 170 },
  { label: 'Oct', shop: 560, phone: 210, partners: 190 },
]

const MARGIN = [
  { label: 'Mon', margin: 420 },
  { label: 'Tue', margin: -180 },
  { label: 'Wed', margin: 310 },
  { label: 'Thu', margin: -60 },
  { label: 'Fri', margin: 520 },
  { label: 'Sat', margin: 240 },
  { label: 'Sun', margin: -90 },
]

/** Bars side by side or piled up: changing it moves them from one to the other. */
function Bars() {
  const [variant, setVariant] = useState<'grouped' | 'stacked'>('grouped')
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <SegmentedControl
          label="Bars"
          size="sm"
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'grouped', label: 'Side by side' },
            { value: 'stacked', label: 'Stacked' },
          ]}
        />
        <BarChart
          ariaLabel="Orders by channel and month"
          variant={variant}
          data={MONTHS}
          series={[
            { key: 'shop', label: 'Shop' },
            { key: 'phone', label: 'Phone' },
            { key: 'partners', label: 'Partners' },
          ]}
        />
      </div>
      <BarChart
        ariaLabel="Margin by day"
        tone="sign"
        height={220}
        data={MARGIN}
        series={[{ key: 'margin', label: 'Margin' }]}
        formatValue={(value) => formatMoney(value)}
      />
    </div>
  )
}

/** A legend whose items show or hide their series: the chart decides that one is always left. */
function Legends() {
  const [shown, setShown] = useState([true, true, true, true])
  const toggle = (index: number) =>
    setShown((now) => (now[index] && now.filter(Boolean).length === 1 ? now : now.map((each, at) => (at === index ? !each : each))))
  return (
    <div className="flex flex-col gap-4">
      <ChartLegend label="Runs" items={RUNS} />
      <ChartLegend label="Runs shown" items={RUNS.map((run, index) => ({ ...run, shown: shown[index] }))} onToggle={toggle} />
    </div>
  )
}

export function Charts() {
  const calendar = useMemo(days, [])
  const matrix = useMemo(hours, [])
  return (
    <>
      <PageHeader title="Charts" description="Drawn in the chart colours of both themes, each with a table or a summary for screen readers." />

      <Demo
        id="sparkline"
        title="Sparkline"
        description="The trend of a figure, small and without axes: in a tile, in a table's cell. Its colour says the direction; where down is good (a delay), it is given its tone. Bars start at zero, a loss below."
        names={['Sparkline']}
        className="block w-full space-y-4"
      >
        <KpiGrid>
          <KpiTile label="Orders this week" value="1,284" hint="+12% on last week">
            <Sparkline label="Orders per day" values={[160, 172, 168, 190, 184, 201, 209]} width={180} height={32} />
          </KpiTile>
          <KpiTile label="Median delivery" value="2.4 days" hint="−0.3 on last week">
            <Sparkline label="Median delivery, days" values={[2.9, 2.8, 2.7, 2.7, 2.5, 2.4, 2.4]} tone="positive" width={180} height={32} />
          </KpiTile>
          <KpiTile label="Margin by day" value={formatMoney(1840)} hint="5 days of 7 above zero">
            <Sparkline label="Margin by day" variant="bars" values={[420, 380, -120, 510, -60, 330, 380]} width={180} height={32} />
          </KpiTile>
          <KpiTile label="Returns" value="38" hint="Steady">
            <Sparkline label="Returns per day" values={[6, 5, 6, 5, 6, 5, 5]} tone="neutral" width={180} height={32} />
          </KpiTile>
        </KpiGrid>
      </Demo>

      <Demo
        id="legend"
        title="ChartLegend"
        description="What a chart's colours stand for, each swatch drawn as the chart draws its series: a bar, a line, a dashed line, a point. Its items can show and hide their series. For an application's own charts too."
        names={['ChartLegend']}
        className="block w-full"
      >
        <Legends />
      </Demo>

      <Demo
        id="bar"
        title="BarChart"
        description="Values by category, side by side or stacked, things compared in the four compare colours (never recycled). Losses go below zero, and a sign's tone colours each bar as a gain or a loss. The arrow keys move from one category to the next; a table gives screen readers every figure."
        names={['BarChart']}
        className="block w-full"
      >
        <Bars />
      </Demo>

      <Demo
        id="heatmap"
        title="ActivityHeatmap"
        description="Days, or weekday by hour. Signed values take two scales (gains in teal, losses in red), each step one size on either side; a cell with nothing is not a cell of zero."
        names={['ActivityHeatmap']}
        className="block w-full space-y-6"
      >
        <ActivityHeatmap
          data={calendar}
          startDate={calendar[0]?.date}
          weeks={21}
          summary={`${formatMoney(calendar.reduce((sum, day) => sum + day.value, 0), 'EUR', true)} over ${calendar.length} days`}
          diverging={GAIN_LOSS}
          weekStart={1}
          format={(value) => formatMoney(value, 'EUR', true)}
          legend={['Loss', 'Gain']}
          ariaLabel="Result of each day"
        />
        <ActivityHeatmap
          mode="hours"
          matrix={matrix}
          rowLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
          hours={[9, 10, 11, 12, 13, 14, 15, 16, 17]}
          unit="orders"
          emptyText="Closed"
          ariaLabel="Orders by weekday and hour"
        />
      </Demo>

      <Demo
        id="funnel"
        title="FunnelChart"
        description="Where things went, stage after stage: what each stage lost on the way to the next, in words."
        names={['FunnelChart']}
        className="block w-full"
      >
        <FunnelChart
          noun="Visits"
          summaryLabel="of the visits ended in a purchase"
          formatValue={(value) => value.toLocaleString('en-GB')}
          stages={[
            { label: 'Visited', value: 12480, dropLabel: 'left on the first page' },
            { label: 'Saw a product', value: 5210, dropLabel: 'did not add it' },
            { label: 'Added to the basket', value: 1380, dropLabel: 'left the basket' },
            { label: 'Paid', value: 642 },
          ]}
        />
      </Demo>

      <Demo
        id="live-line"
        title="LiveLineChart"
        description="A value as it arrives, over the last minutes: a frame only when the line moves, a pause for reading it."
        names={['LiveLineChart']}
        className="block w-full"
      >
        <LiveLineChart
          source={wander}
          windowSeconds={60}
          height={180}
          formatValue={(value) => `${value.toFixed(1)} ms`}
          formatChange={(change) => formatPercent(change, true, 1)}
          ariaLabel="Response time"
        />
      </Demo>

      <Demo
        id="trace"
        title="DependencyTrace"
        description="What calls what: a node's health is a ring, an icon and a word; tracing one (a click, Enter) says what it calls and what calls it."
        names={['DependencyTrace']}
        className="block w-full"
      >
        <DependencyTrace
          label="Services"
          width={520}
          height={260}
          nodes={[
            { id: 'web', label: 'Website', type: 'client', x: 70, y: 130 },
            { id: 'api', label: 'API', type: 'service', x: 210, y: 130, status: 'ok', statusLabel: 'Up' },
            { id: 'db', label: 'Database', type: 'database', x: 360, y: 60, status: 'ok', statusLabel: 'Up' },
            { id: 'queue', label: 'Queue', type: 'service', x: 360, y: 200, status: 'warning', statusLabel: 'Degraded', detail: '1,204 waiting' },
            { id: 'mail', label: 'Mail', type: 'api', x: 470, y: 200 },
          ]}
          connections={[
            { from: 'web', to: 'api', label: 'HTTP' },
            { from: 'api', to: 'db', label: 'SQL' },
            { from: 'api', to: 'queue', label: 'jobs' },
            { from: 'queue', to: 'mail', label: 'SMTP' },
          ]}
        />
      </Demo>
    </>
  )
}
