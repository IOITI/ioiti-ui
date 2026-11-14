import { Calendar } from 'ioiti-ui'

// Deliveries are booked from 16 Nov to 18 Dec 2026, on weekdays.
const FIRST = new Date(2026, 10, 16)
const LAST = new Date(2026, 11, 18)
const weekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6

export default function CalendarLimits() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <Calendar
        mode="single"
        defaultMonth={FIRST}
        minDate={FIRST}
        maxDate={LAST}
        isDateDisabled={weekend}
        locale="en-GB"
        weekStartsOn={1}
        className="rounded-xl border border-border"
      />
      <p className="max-w-56 text-sm text-muted-foreground">From 16 Nov to 18 Dec, on weekdays: the months before and after cannot be reached.</p>
    </div>
  )
}
