import { DateRangeFilter, formatDay, lastDays, toIsoDay } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'

// The day the page is read on: fixed here, today in an application.
const TODAY = new Date(2026, 10, 14)

export default function DateRangeFilterPresets() {
  const [range, setRange] = useState<DateRange>(() => lastDays(30, TODAY))
  return (
    <div className="flex flex-col items-start gap-3">
      <DateRangeFilter value={range} onChange={setRange} today={TODAY} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {range.from && range.to
          ? `Orders from ${formatDay(toIsoDay(range.from))} to ${formatDay(toIsoDay(range.to))}.`
          : range.from
            ? `Orders from ${formatDay(toIsoDay(range.from))}…`
            : 'Every order.'}
      </p>
    </div>
  )
}
