import { Badge, formatMoney, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

import { ORDERS, STATUS } from '../../../samples/tables'

export default function TableRecords() {
  return (
    <Table aria-label="Latest orders">
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
        {ORDERS.slice(0, 5).map((order) => (
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
