import { DateRangeFilter, lastDays, rangeParams } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'

// The last day there is data for: the imports stopped on 23 Oct.
const LAST_DATA = new Date(2026, 9, 23)

const PRESETS = [
  { label: 'Last week of data', days: 7 },
  { label: 'Third quarter', range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) } },
]

export default function DateRangeFilterDataDays() {
  const [range, setRange] = useState<DateRange>(() => lastDays(7, LAST_DATA))
  const { from, to } = rangeParams(range)
  return (
    <div className="flex flex-col items-start gap-3">
      <DateRangeFilter
        value={range}
        onChange={setRange}
        allTime={false}
        today={LAST_DATA}
        maxDate={LAST_DATA}
        presets={PRESETS}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Asked for: <code className="font-mono text-xs">from={from ?? 'none'} to={to ?? 'none'}</code>
      </p>
    </div>
  )
}
