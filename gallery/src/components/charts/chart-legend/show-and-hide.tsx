import { ChartLegend, formatMoney, LineChart } from 'ioiti-ui'
import { useState } from 'react'

import { REVENUE_BY_SHOP } from '../../../samples/charts'

// Each series keeps its colour (its compare token, in order) when another is hidden.
const SERIES = [
  { key: 'north', label: 'North street', color: 'var(--chart-compare-1)' },
  { key: 'harbour', label: 'Harbour', color: 'var(--chart-compare-2)' },
  { key: 'station', label: 'Station', color: 'var(--chart-compare-3)' },
]

export default function ChartLegendShowAndHide() {
  const [shown, setShown] = useState([true, true, true])
  // The chart decides what it allows: one series is always left.
  const toggle = (index: number) =>
    setShown((now) => (now[index] && now.filter(Boolean).length === 1 ? now : now.map((each, at) => (at === index ? !each : each))))
  return (
    <div className="space-y-4">
      <ChartLegend
        label="Shops shown"
        items={SERIES.map((series, index) => ({ label: series.label, color: series.color, shape: 'line' as const, shown: shown[index] }))}
        onToggle={toggle}
      />
      <LineChart
        ariaLabel="Revenue of the shops shown, each week since May"
        data={REVENUE_BY_SHOP}
        series={SERIES.filter((_, index) => shown[index])}
        showLegend={false}
        zero
        height={220}
        timeZone="Europe/Paris"
        formatValue={(value) => formatMoney(value)}
      />
      <p className="text-xs text-muted-foreground">Shown: {SERIES.filter((_, index) => shown[index]).map((series) => series.label).join(', ')}</p>
    </div>
  )
}
