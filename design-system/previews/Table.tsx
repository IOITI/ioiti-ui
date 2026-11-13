import { Badge, SignedValue, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const ORDERS = [
  { id: '2026-0042', customer: 'Acme', status: 'open', amount: 1840 },
  { id: '2026-0041', customer: 'Globex', status: 'sent', amount: 960.5 },
  { id: '2026-0040', customer: 'Initech', status: 'late', amount: 4320 },
  { id: '2026-0039', customer: 'Umbrella', status: 'sent', amount: 415 },
] as const
const STATUS = { open: { label: 'Open', tone: 'neutral' }, sent: { label: 'Sent', tone: 'success' }, late: { label: 'Late', tone: 'danger' } } as const

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-stretch gap-6 p-5">
    <Table className="min-w-[36rem]" aria-label="Latest orders">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ORDERS.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
            <TableCell className="font-medium text-foreground">{order.customer}</TableCell>
            <TableCell><Badge tone={STATUS[order.status].tone}>{STATUS[order.status].label}</Badge></TableCell>
            <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Table density="dense" aria-label="Orders by week">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Week</TableHeaderCell>
          <TableHeaderCell numeric>Orders</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
          <TableHeaderCell numeric>Change</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {([
          ['Week 41', 38, 21480, 4.2],
          ['Week 42', 41, 23950, 11.5],
          ['Week 43', 36, 19870, -17],
        ] as const).map(([week, orders, amount, change]) => (
          <TableRow key={week}>
            <TableHeaderCell>{week}</TableHeaderCell>
            <TableCell numeric>{orders}</TableCell>
            <TableCell numeric>{formatMoney(amount, 'EUR')}</TableCell>
            <TableCell numeric><SignedValue value={change} kind="percent" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>,
)
