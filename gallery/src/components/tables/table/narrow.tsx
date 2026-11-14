import { Badge, formatMoney, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

import { CHANNEL, ORDERS, STATUS } from '../../../samples/tables'

export default function TableNarrow() {
  return (
    <div className="max-w-sm rounded-xl border border-dashed border-border p-3">
      {/* Wider than its room (min-w): it scrolls in its own frame. */}
      <Table className="min-w-[36rem]" aria-label="Orders, a narrow column">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Channel</TableHeaderCell>
            <TableHeaderCell numeric>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ORDERS.slice(0, 4).map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
              <TableCell className="font-medium text-foreground">{order.customer}</TableCell>
              <TableCell>
                <Badge tone={STATUS[order.status].tone}>{STATUS[order.status].label}</Badge>
              </TableCell>
              <TableCell>{CHANNEL[order.channel]}</TableCell>
              <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
