import { DatePicker, DateRangePicker, Field } from 'ioiti-ui'

// Collections are booked from 16 Nov 2026 to 15 Jan 2027, on weekdays.
const FIRST = new Date(2026, 10, 16)
const LAST = new Date(2027, 0, 15)
const weekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6
const CONTRACT = { from: new Date(2026, 0, 1), to: new Date(2026, 11, 31) }

export default function DatePickerLimits() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Collection day" description="A weekday, from 16 Nov to 15 Jan">
        <DatePicker minDate={FIRST} maxDate={LAST} isDateDisabled={weekend} defaultMonth={FIRST} placeholder="Choose a day" locale="en-GB" weekStartsOn={1} />
      </Field>
      <Field label="Contract" description="Set when it was signed">
        <DateRangePicker defaultValue={CONTRACT} disabled locale="en-GB" weekStartsOn={1} />
      </Field>
    </div>
  )
}
