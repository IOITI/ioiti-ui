import { Calendar, DatePicker, DateRangePicker } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [day, setDay] = useState<Date | null>(new Date(2026, 9, 14))
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 9, 5), to: new Date(2026, 9, 11) })
  return (
    <div className="flex flex-col items-start gap-4 p-5">
      <div className="flex flex-wrap gap-3">
        <DatePicker value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} />
        <DateRangePicker value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
      </div>
      <Calendar mode="single" value={day} onChange={setDay} locale="en-GB" weekStartsOn={1} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
