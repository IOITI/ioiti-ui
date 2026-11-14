import { DatePicker, toIsoDay } from 'ioiti-ui'
import { useState } from 'react'

const NOVEMBER = new Date(2026, 10, 1)

export default function DatePickerDay() {
  const [due, setDue] = useState<Date | null>(() => new Date(2026, 10, 20))
  const [paid, setPaid] = useState<Date | null>(null)
  // A group named by its label: the picker's button says the day, the label what the day is.
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <div role="group" aria-labelledby="picker-due" className="flex flex-col gap-1">
          <span id="picker-due" className="text-xs font-semibold text-text-primary">
            Due on
          </span>
          <DatePicker value={due} onChange={setDue} locale="en-GB" weekStartsOn={1} />
        </div>
        <div role="group" aria-labelledby="picker-paid" className="flex flex-col gap-1">
          <span id="picker-paid" className="text-xs font-semibold text-text-primary">
            Paid on
          </span>
          <DatePicker value={paid} onChange={setPaid} placeholder="Not paid yet" defaultMonth={NOVEMBER} locale="en-GB" weekStartsOn={1} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {due ? `Due on ${toIsoDay(due)}` : 'No due day'} · {paid ? `paid on ${toIsoDay(paid)}` : 'not paid'}
      </p>
    </div>
  )
}
