import { ActivityHeatmap, formatMoney } from 'ioiti-ui'
import type { HeatDay } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

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

const calendar = days()
const matrix = hours()

createRoot(document.getElementById('root')!).render(
  <div className="w-full space-y-6 p-5">
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
  </div>,
)
