import { NotificationBell } from 'ioiti-ui'
import type { Notification } from 'ioiti-ui'
import { useState } from 'react'

const MINUTE = 60_000

export default function NotificationBellItems() {
  // Said from now: made once, when the page opens.
  const [items, setItems] = useState<Notification[]>(() => [
    { id: '1', message: 'Export ready', detail: 'orders-2026-11-14.csv', timestamp: new Date(Date.now() - 2 * MINUTE), read: false, href: '/components/tables', tone: 'success' },
    { id: '2', message: 'Payment refused', detail: 'Order 2026-0042', timestamp: new Date(Date.now() - 14 * MINUTE), read: false, href: '/components/feedback', tone: 'danger' },
    { id: '3', message: 'Stock below its threshold', detail: 'Shelving, warehouse 3', timestamp: new Date(Date.now() - 50 * MINUTE), read: false, tone: 'warning' },
    { id: '4', message: 'Weekly summary sent', timestamp: new Date(Date.now() - 3 * 60 * MINUTE), read: true },
  ])
  const markRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)))
  return (
    // At the end of a top bar.
    <div className="flex h-14 w-full items-center justify-end rounded-xl border border-border px-4 glass-bar">
      <NotificationBell
        notifications={items}
        onMarkAsRead={markRead}
        onMarkAllAsRead={() => setItems((list) => list.map((item) => ({ ...item, read: true })))}
        footer={<p className="px-4 py-2 text-xs text-muted-foreground">The last 7 days, kept for this tab.</p>}
      />
    </div>
  )
}
