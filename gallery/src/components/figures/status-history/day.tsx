import { StatusHistory } from 'ioiti-ui'
import type { StatusHistorySlot } from 'ioiti-ui'

// A day of an API, an hour a block: down once in the night, slow in the afternoon.
const DAY: StatusHistorySlot[] = Array.from({ length: 24 }, (_, hour) => ({
  status: hour === 3 ? 'down' : hour === 14 || hour === 15 ? 'warning' : 'ok',
  at: `${String(hour).padStart(2, '0')}:00`,
}))

export default function StatusHistoryDay() {
  return (
    <div className="space-y-4">
      <StatusHistory label="API, the last 24 hours" slots={DAY} scale={['24 h ago', 'Now']} />
      <p className="text-xs text-muted-foreground">Read as: API, the last 24 hours: 21 hours up, 1 down at 03:00, 2 degraded at 14:00 and 15:00.</p>
    </div>
  )
}
