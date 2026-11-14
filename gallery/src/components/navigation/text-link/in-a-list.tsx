import { formatMoney, TextLink } from 'ioiti-ui'

const ORDERS = [
  { id: '2026-0042', customer: 'Atelier Brun', amount: 1840 },
  { id: '2026-0041', customer: 'Maison Vidal', amount: 960.5 },
  { id: '2026-0040', customer: 'Studio Nord', amount: 4320 },
]

export default function TextLinkInAList() {
  return (
    <ul className="max-w-md divide-y divide-border/40 text-sm">
      {ORDERS.map((order) => (
        <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
          <span className="flex min-w-0 items-center gap-3">
            <TextLink to="/components/tables/interactive-timeline" variant="hover" className="font-mono">
              {order.id}
            </TextLink>
            <span className="truncate text-muted-foreground">{order.customer}</span>
          </span>
          <span className="tabular-nums">{formatMoney(order.amount, 'EUR')}</span>
        </li>
      ))}
    </ul>
  )
}
