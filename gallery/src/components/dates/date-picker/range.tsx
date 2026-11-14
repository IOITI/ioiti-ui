import { DateRangePicker, rangeParams } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'

export default function DatePickerRange() {
  const [range, setRange] = useState<DateRange>(() => ({ from: new Date(2026, 9, 16), to: new Date(2026, 10, 14) }))
  const { from, to } = rangeParams(range)
  return (
    <div className="flex flex-col items-start gap-3">
      <DateRangePicker value={range} onChange={setRange} locale="en-GB" weekStartsOn={1} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <code className="font-mono text-xs">
          ?from={from ?? ''}&amp;to={to ?? ''}
        </code>
      </p>
    </div>
  )
}
