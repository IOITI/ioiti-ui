import { ChartLegend } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const RUNS = [
  { label: 'Run 41', color: 'var(--chart-compare-1)', shape: 'line' as const, value: '+4.2%' },
  { label: 'Run 42', color: 'var(--chart-compare-2)', shape: 'line' as const, value: '+1.8%' },
  { label: 'Benchmark', color: 'var(--chart-muted)', shape: 'dashed' as const, value: '+0.9%' },
  { label: 'Trades', color: 'var(--chart-compare-3)', shape: 'dot' as const },
  { label: 'Restart', color: 'var(--chart-axis)', shape: 'marker' as const },
]

/** A legend whose items show or hide their series: the chart decides that one is always left. */
function Preview() {
  const [shown, setShown] = useState(() => RUNS.map(() => true))
  const toggle = (index: number) =>
    setShown((now) => (now[index] && now.filter(Boolean).length === 1 ? now : now.map((each, at) => (at === index ? !each : each))))
  return (
    <div className="flex flex-col gap-4 p-5">
      <ChartLegend label="Runs" items={RUNS} />
      <ChartLegend label="Runs shown" items={RUNS.map((run, index) => ({ ...run, shown: shown[index] }))} onToggle={toggle} />
      <p className="text-xs text-muted-foreground">The second legend's items are buttons: pressing one hides its series, one is always left.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
