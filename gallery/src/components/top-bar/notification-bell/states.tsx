import { NotificationBell } from 'ioiti-ui'
import type { Notification } from 'ioiti-ui'
import { useState } from 'react'

const READ_AGAIN: Notification[] = [{ id: '1', message: 'Invoice 2026-0042 paid', timestamp: 'just now', read: false, tone: 'success' }]

export default function NotificationBellStates() {
  // Could not read them, until Try again reads them, a moment later.
  const [failed, setFailed] = useState(true)
  const [reading, setReading] = useState(false)
  const [items, setItems] = useState<Notification[]>([])
  const retry = () => {
    setFailed(false)
    setReading(true)
    window.setTimeout(() => {
      setReading(false)
      setItems(READ_AGAIN)
    }, 900)
  }
  const markRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)))
  return (
    <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        Reading
        <NotificationBell notifications={[]} onMarkAsRead={() => {}} loading />
      </span>
      <span className="flex items-center gap-2">
        Could not read them
        <NotificationBell notifications={items} onMarkAsRead={markRead} loading={reading} error={failed} onRetry={retry} />
      </span>
      <span className="flex items-center gap-2">
        Nothing new
        <NotificationBell notifications={[]} onMarkAsRead={() => {}} />
      </span>
    </div>
  )
}
