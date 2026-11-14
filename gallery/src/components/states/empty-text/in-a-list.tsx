import { Button, EmptyText, Panel } from 'ioiti-ui'
import { useState } from 'react'

const ORDERS = ['IT-1044 · Acme · 420.00 €', 'IT-1043 · Globex · 96.50 €']

export default function EmptyTextInAList() {
  const [orders, setOrders] = useState<string[]>([])
  return (
    <div className="max-w-md">
      <Panel
        title="Today’s orders"
        action={
          <Button size="xs" variant="ghost" onClick={() => setOrders(orders.length ? [] : ORDERS)}>
            {orders.length ? 'Empty it' : 'Fill it'}
          </Button>
        }
      >
        {orders.length === 0 ? (
          <EmptyText>No order yet today: they appear here as they are placed.</EmptyText>
        ) : (
          <ul className="divide-y divide-border text-sm" aria-label="Today’s orders">
            {orders.map((order) => (
              <li key={order} className="py-2">
                {order}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}
