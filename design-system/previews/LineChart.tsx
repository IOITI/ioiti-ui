import { LineChart, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const DAY = 86_400_000
const HOUR = 3_600_000
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}
function runs() {
  const random = seeded(23)
  const start = Date.UTC(2026, 7, 3)
  const balances = [10_000, 10_000, 10_000, 10_000]
  const drift = [0.004, 0.0025, 0.001, -0.0008]
  return Array.from({ length: 60 }, (_, day) => {
    balances.forEach((balance, run) => {
      balances[run] = balance * (1 + drift[run] + (random() - 0.5) * 0.02)
    })
    return { t: start + day * DAY, a: balances[0], b: balances[1], c: balances[2], d: balances[3] }
  })
}
function delays() {
  const random = seeded(31)
  const start = Date.UTC(2026, 9, 27, 6)
  return Array.from({ length: 72 }, (_, index) => ({
    t: start + index * (HOUR / 6),
    delay: index === 40 || index === 41 ? null : Math.round(120 + Math.sin(index / 7) * 40 + random() * 60 + (index > 50 ? 60 : 0)),
  }))
}

createRoot(document.getElementById('root')!).render(
  <div className="w-full space-y-8 p-5">
    <LineChart
      ariaLabel="Balance of four runs"
      data={runs()}
      series={[
        { key: 'a', label: 'Run 41' },
        { key: 'b', label: 'Run 42' },
        { key: 'c', label: 'Run 43' },
        { key: 'd', label: 'Benchmark', dashed: true },
      ]}
      timeZone="Europe/Paris"
      formatValue={(value) => formatMoney(value)}
    />
    <LineChart
      ariaLabel="Delay of the orders through the day"
      data={delays()}
      series={[{ key: 'delay', label: 'Delay' }]}
      area
      zero
      height={200}
      timeZone="Europe/Paris"
      references={[{ value: 250, label: 'Limit, 250 ms', tone: 'negative' }]}
      markers={[{ t: Date.UTC(2026, 9, 27, 12, 30), label: 'Restart' }]}
      formatValue={(value) => `${Math.round(value)} ms`}
    />
  </div>,
)
