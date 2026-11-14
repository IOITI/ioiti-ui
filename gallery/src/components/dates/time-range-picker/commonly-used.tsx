import { formatTimeRange, TimeRangePicker } from 'ioiti-ui'
import type { CommonRange, TimeRange } from 'ioiti-ui'
import { useState } from 'react'

// The ranges a warehouse's day is read over.
const WAREHOUSE: CommonRange[] = [
  { label: 'Last 8 hours (a shift)', range: { from: 'now-8h', to: 'now' } },
  { label: 'Today so far', range: { from: 'now/d', to: 'now' } },
  { label: 'Yesterday', range: { from: 'now-1d/d', to: 'now-1d/d' } },
  { label: 'This week so far', range: { from: 'now/w', to: 'now' } },
  { label: 'Last week', range: { from: 'now-1w/w', to: 'now-1w/w' } },
  { label: 'This month so far', range: { from: 'now/M', to: 'now' } },
]

export default function TimeRangePickerCommonlyUsed() {
  const [range, setRange] = useState<TimeRange>({ from: 'now/d', to: 'now' })
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <TimeRangePicker value={range} onChange={setRange} commonlyUsed={WAREHOUSE} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Parcels sent: {formatTimeRange(range)} <code className="font-mono text-xs">({range.from} → {range.to})</code>
      </p>
    </div>
  )
}
