import { StatusHistory } from 'ioiti-ui'
import type { StatusHistorySlot } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

// A day of an API, an hour a block: down once in the night, slow in the afternoon.
const DAY: StatusHistorySlot[] = Array.from({ length: 24 }, (_, hour) => ({
  status: hour === 3 ? 'down' : hour === 14 || hour === 15 ? 'warning' : 'ok',
  at: `${String(hour).padStart(2, '0')}:00`,
}))

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col gap-3 p-5">
    <StatusHistory label="API, the last 24 hours" slots={DAY} scale={['24 h ago', 'Now']} />
    <p className="text-xs text-muted-foreground">Read as: 21 hours up, 1 down at 03:00, 2 degraded at 14:00 and 15:00.</p>
  </div>,
)
