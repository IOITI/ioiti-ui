import { Calendar, toIsoDay, useFormat } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  const { formatDay } = useFormat()
  const [day, setDay] = useState<Date | null>(() => new Date(2026, 10, 14))
  return (
    <div className="flex flex-wrap items-start gap-6 p-5">
      <Calendar mode="single" value={day} onChange={setDay} className="rounded-xl border border-border" />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {day ? `Delivery on ${formatDay(toIsoDay(day))}.` : 'No day chosen.'}
      </p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
