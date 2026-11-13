import { NotificationBell } from 'ioiti-ui'
import type { Notification } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const MINUTE = 60_000

function Bell() {
  const [items, setItems] = useState<Notification[]>(() => [
    { id: '1', message: 'Export ready', detail: 'orders-2026-10-26.csv', timestamp: new Date(Date.now() - 2 * MINUTE), read: false, href: '#export', tone: 'success' },
    { id: '2', message: 'Payment refused', detail: 'Order 2026-0042', timestamp: new Date(Date.now() - 14 * MINUTE), read: false, href: '#order-2026-0042', tone: 'danger' },
    { id: '3', message: 'Weekly summary sent', timestamp: new Date(Date.now() - 3 * 60 * MINUTE), read: true },
  ])
  const markRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)))
  return (
    <NotificationBell
      notifications={items}
      onMarkAsRead={markRead}
      onMarkAllAsRead={() => setItems((list) => list.map((item) => ({ ...item, read: true })))}
      footer={<p className="px-4 py-2 text-xs text-muted-foreground">Kept for this tab.</p>}
    />
  )
}

/** The bell before it has read anything, and when it could not. */
function BellStates() {
  const [failed, setFailed] = useState(true)
  return (
    <>
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        Reading
        <NotificationBell notifications={[]} onMarkAsRead={() => {}} loading />
      </span>
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        Could not read them
        <NotificationBell notifications={[]} onMarkAsRead={() => {}} loading={!failed} error={failed} onRetry={() => setFailed(false)} />
      </span>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex min-h-[26rem] flex-col items-stretch p-5">
    {/* At the end of a row, as in a top bar: the list opens under the bell, towards the page. */}
    <div className="flex flex-wrap items-center justify-end gap-6">
      <span className="mr-auto text-xs text-muted-foreground">Press a bell: its list opens under it. Escape closes it.</span>
      <BellStates />
      <Bell />
    </div>
  </div>,
)
