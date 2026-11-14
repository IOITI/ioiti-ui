import { RelativeTime } from 'ioiti-ui'
import { useState } from 'react'

const MINUTE = 60_000

// Each event, so many minutes before the page was opened.
const EVENTS = [
  { id: 'e1', text: 'Order IT-1042 left the warehouse', before: 2 },
  { id: 'e2', text: 'Invoice 2026-311 paid by Atelier Brun', before: 18 },
  { id: 'e3', text: 'Delivery to Lille delayed by the carrier', before: 95 },
  { id: 'e4', text: 'Import of the October invoices finished', before: 26 * 60 },
  { id: 'e5', text: 'Price list for 2027 published', before: 4 * 24 * 60 },
]

export default function RelativeTimeInAList() {
  const [opened] = useState(() => Date.now())
  return (
    <ul className="w-full max-w-lg divide-y divide-border rounded-xl border border-border text-sm">
      {EVENTS.map((event) => (
        <li key={event.id} className="flex items-baseline justify-between gap-4 px-3 py-2">
          <span className="min-w-0 truncate">{event.text}</span>
          <RelativeTime value={opened - event.before * MINUTE} timeZone="Europe/Paris" className="shrink-0 tabular-nums text-muted-foreground" />
        </li>
      ))}
    </ul>
  )
}
