import { ActivityHeatmap, DependencyTrace, formatMoney, formatPercent, FunnelChart, LiveLineChart, PageHeader } from 'ioiti-ui'
import type { HeatDay } from 'ioiti-ui'
import { useMemo } from 'react'

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

export function Charts() {
  const calendar = useMemo(days, [])
  const matrix = useMemo(hours, [])
  return (
    <>
      <PageHeader title="Charts" description="Drawn in the chart colours of both themes, each with a table or a summary for screen readers." />

      <Demo
        id="heatmap"
        title="ActivityHeatmap"
        description="Days, or weekday by hour. Signed values take two scales (gains in teal, losses in red), each step one size on either side; a cell with nothing is not a cell of zero."
        names={['ActivityHeatmap']}
        className="block w-full space-y-6"
      >
        <ActivityHeatmap
          data={calendar}
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
