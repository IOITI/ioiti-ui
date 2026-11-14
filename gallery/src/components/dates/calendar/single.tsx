import { Calendar, formatDay, toIsoDay } from 'ioiti-ui'
import { useState } from 'react'

export default function CalendarSingle() {
  const [day, setDay] = useState<Date | null>(() => new Date(2026, 10, 14))
  return (
    <div className="flex flex-wrap items-start gap-6">
      <Calendar mode="single" value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} className="rounded-xl border border-border" />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {day ? `Delivery on ${formatDay(toIsoDay(day))}.` : 'No day chosen.'}
      </p>
    </div>
  )
}
