import { Calendar, formatDay, toIsoDay } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange>(() => ({ from: new Date(2026, 10, 9), to: new Date(2026, 10, 14) }))
  const said = (day: Date | null) => (day ? formatDay(toIsoDay(day)) : '…')
  return (
    <div className="flex flex-wrap items-start gap-6">
      <Calendar mode="range" value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} className="rounded-xl border border-border" />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {range.from ? `From ${said(range.from)} to ${said(range.to)}.` : 'No range chosen.'}
      </p>
    </div>
  )
}
