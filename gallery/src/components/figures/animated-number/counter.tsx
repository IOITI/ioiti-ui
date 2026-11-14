import { AnimatedNumber, Button } from 'ioiti-ui'
import { useState } from 'react'

export default function AnimatedNumberCounter() {
  const [orders, setOrders] = useState(1284)
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <p className="flex items-baseline gap-2">
        <AnimatedNumber value={orders} className="text-3xl font-semibold" />
        <span className="text-sm text-muted-foreground">orders this month</span>
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setOrders(orders + 1)}>
          One more
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOrders(orders + 250)}>
          250 more
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOrders(1284)}>
          Back to 1,284
        </Button>
      </div>
    </div>
  )
}
