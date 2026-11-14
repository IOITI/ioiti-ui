import { Avatar, formatMoney } from 'ioiti-ui'

const AVATARS = `${import.meta.env.BASE_URL}avatars`

const ORDERS = [
  { id: '2026-0042', by: 'Ana María Ortiz', src: `${AVATARS}/ana.svg`, amount: 1840 },
  { id: '2026-0041', by: 'Jonas Weber', amount: 960.5 },
  { id: '2026-0040', by: 'Yuki Sato', src: `${AVATARS}/yuki.svg`, amount: 312 },
]

export default function AvatarInAList() {
  return (
    <ul aria-label="Latest orders" className="max-w-md divide-y divide-border/40 text-sm">
      {ORDERS.map((order) => (
        <li key={order.id} className="flex items-center gap-3 py-2.5">
          <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {/* Its name is written beside it: the avatar says nothing more to a screen reader. */}
            <span aria-hidden className="contents">
              <Avatar name={order.by} src={order.src} size="xs" />
            </span>
            <span className="truncate">{order.by}</span>
          </span>
          <span className="tabular-nums">{formatMoney(order.amount, 'EUR')}</span>
        </li>
      ))}
    </ul>
  )
}
