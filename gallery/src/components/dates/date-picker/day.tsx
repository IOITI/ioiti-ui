import { DatePicker, Field, toIsoDay } from 'ioiti-ui'
import { useState } from 'react'

const NOVEMBER = new Date(2026, 10, 1)

export default function DatePickerDay() {
  const [due, setDue] = useState<Date | null>(() => new Date(2026, 10, 20))
  const [paid, setPaid] = useState<Date | null>(null)
  // In a Field, as any control: its label names the picker's button, which says the day.
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Field label="Due on">
          <DatePicker value={due} onChange={setDue} locale="en-GB" weekStartsOn={1} />
        </Field>
        <Field label="Paid on" error={paid && due && paid > due ? 'Paid after the day it was due' : undefined}>
          <DatePicker value={paid} onChange={setPaid} placeholder="Not paid yet" defaultMonth={NOVEMBER} locale="en-GB" weekStartsOn={1} />
        </Field>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {due ? `Due on ${toIsoDay(due)}` : 'No due day'} · {paid ? `paid on ${toIsoDay(paid)}` : 'not paid'}
      </p>
    </div>
  )
}
