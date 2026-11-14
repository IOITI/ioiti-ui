import { NotificationBell } from 'ioiti-ui'
import type { Notification } from 'ioiti-ui'
import { useState } from 'react'

export default function NotificationBellQuiet() {
  const [items, setItems] = useState<Notification[]>([
    // Words rather than a date: said as they are.
    { id: '1', message: 'Your report is ready', detail: 'Sales, October', timestamp: 'this morning', read: false, href: '/components/charts', tone: 'info' },
    { id: '2', message: 'Léa Brun commented on order 2026-0041', timestamp: 'yesterday', read: false, tone: 'neutral' },
  ])
  const markRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)))
  return (
    <div className="flex h-14 w-full items-center justify-end rounded-xl border border-border px-4 glass-bar">
      <NotificationBell
        notifications={items}
        onMarkAsRead={markRead}
        onMarkAllAsRead={() => setItems((list) => list.map((item) => ({ ...item, read: true })))}
        showCount={false}
      />
    </div>
  )
}
