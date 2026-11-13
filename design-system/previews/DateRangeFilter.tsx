import { DateRangeFilter, lastDays } from 'ioiti-ui'
import type { DateRange } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const [range, setRange] = useState<DateRange>(lastDays(30))
  return (
    <div className="flex flex-col items-start gap-4 p-5">
      <DateRangeFilter value={range} onChange={setRange} />
      <DateRangeFilter
        value={range}
        onChange={setRange}
        allTime={false}
        today={new Date(2026, 9, 23)}
        maxDate={new Date(2026, 9, 23)}
        presets={[
          { label: 'Last week of data', days: 7 },
          { label: 'Third quarter', range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) } },
        ]}
      />
      <p className="text-xs text-muted-foreground">The range shown is filled; the field after the buttons opens the calendar, for any other.</p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
