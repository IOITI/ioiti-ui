import { Badge, Button, Input, ProductTour } from 'ioiti-ui'
import { Download, Search } from 'lucide-react'
import { useRef, useState } from 'react'

export default function ProductTourTour() {
  const [open, setOpen] = useState(false)
  // Each step a part of what it walks through: a ref here, or a CSS selector.
  const search = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const exporting = useRef<HTMLButtonElement>(null)
  return (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm" onClick={() => setOpen(true)}>
        Take the tour
      </Button>
      <div className="w-full max-w-lg rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2">
          <div ref={search} className="flex-1">
            <Input leftIcon={<Search className="size-4" />} placeholder="An order, a customer…" aria-label="Search the orders" />
          </div>
          <Button ref={exporting} size="sm" variant="outline" leftIcon={<Download />}>
            Export
          </Button>
        </div>
        <ul ref={list} className="mt-3 divide-y divide-border text-sm" aria-label="Orders">
          {[
            { id: 'IT-1042', customer: 'Acme', state: 'Paid' },
            { id: 'IT-1041', customer: 'Globex', state: 'Open' },
          ].map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 py-2">
              <span>
                <span className="font-mono text-xs">{order.id}</span> · {order.customer}
              </span>
              <Badge tone={order.state === 'Paid' ? 'success' : 'neutral'}>{order.state}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <ProductTour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { title: 'The orders, in three steps', body: 'The arrows move from one to the next, Escape ends it.' },
          { target: search, title: 'Find one', body: 'Every word typed must be in the order: its number, its customer.', placement: 'bottom' },
          { target: list, title: 'The newest first', body: 'Each with its state, in a word.', placement: 'bottom' },
          { target: exporting, title: 'Take them with you', body: 'The orders shown, as a CSV file.', placement: 'left' },
          { title: 'That is all', body: 'The tour is in the help menu, to take again.' },
        ]}
      />
    </div>
  )
}
