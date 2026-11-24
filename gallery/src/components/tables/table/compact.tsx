import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, useFormat } from 'ioiti-ui'

import { ORDERS, STATUS } from '../../../samples/tables'

export default function TableCompact() {
  const { formatMoney } = useFormat()
  return (
    <Table density="compact" aria-label="All orders">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Placed</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ORDERS.slice(0, 8).map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
            <TableCell className="font-medium text-foreground">{order.customer}</TableCell>
            <TableCell>
              <Badge tone={STATUS[order.status].tone}>{STATUS[order.status].label}</Badge>
            </TableCell>
            <TableCell>{order.placed}</TableCell>
            <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
