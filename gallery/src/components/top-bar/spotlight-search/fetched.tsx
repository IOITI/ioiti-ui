import { Button, Checkbox, SpotlightSearch, useFormat } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { Receipt, Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { ORDERS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

// As a server would answer, after a moment: the orders whose number or customer holds every word.
function ordersFor(query: string): Order[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  return ORDERS.filter((order) => words.every((word) => `${order.id} ${order.customer}`.toLowerCase().includes(word)))
}

export default function SpotlightSearchFetched() {
  const [open, setOpen] = useState(false)
  const [found, setFound] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [failNext, setFailNext] = useState(false)
  // The latest search asked: the answer to an older one is dropped (it may come last).
  const asked = useRef(0)
  const query = useRef('')
  // The orders found, as the palette lists them: their amounts in the application's locale.
  const { formatMoney } = useFormat()
  const items = useMemo<SpotlightSearchItem[]>(
    () =>
      found.map((order) => ({
        id: order.id,
        title: `Order ${order.id}`,
        category: 'Orders',
        description: `${order.customer} · ${formatMoney(order.amount)}`,
        href: '/components/tables',
        icon: <Receipt />,
      })),
    [found, formatMoney],
  )

  const search = (text: string) => {
    query.current = text
    const request = ++asked.current
    // At once, before the request waits: the palette never says "No results" before it knows.
    setLoading(true)
    setFailed(false)
    const fails = failNext
    setFailNext(false)
    window.setTimeout(() => {
      if (request !== asked.current) return
      setLoading(false)
      if (fails) setFailed(true)
      else setFound(ordersFor(text))
    }, 700)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline" size="sm" leftIcon={<Search />} onClick={() => setOpen(true)}>
        Find an order…
      </Button>
      <Checkbox label="The next search fails" checked={failNext} onChange={(event) => setFailNext(event.target.checked)} />
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Find an order"
        placeholder="A number, a customer…"
        // What the server found, as it found it: not filtered again, the words typed still marked.
        filter={false}
        onQueryChange={search}
        items={items}
        loading={loading}
        error={failed}
        onRetry={() => search(query.current)}
      />
    </div>
  )
}
