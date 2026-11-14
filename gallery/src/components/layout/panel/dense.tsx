import { Badge, formatMoney, Panel, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextLink } from 'ioiti-ui'
import type { BadgeTone } from 'ioiti-ui'

const ORDERS: { id: string; customer: string; status: string; tone: BadgeTone; amount: number }[] = [
  { id: '2026-0042', customer: 'Acme', status: 'Sent', tone: 'neutral', amount: 1840 },
  { id: '2026-0041', customer: 'Globex', status: 'Delivered', tone: 'success', amount: 960.5 },
  { id: '2026-0040', customer: 'Lindqvist & Co', status: 'Late', tone: 'warning', amount: 312 },
  { id: '2026-0039', customer: 'Riverside Bakery', status: 'Delivered', tone: 'success', amount: 2205.75 },
]

export default function PanelDense() {
  return (
    <Panel title="Latest orders" description="The four sent last." action={<TextLink to="/components/tables" variant="quiet">All orders</TextLink>} dense>
      <Table aria-label="Latest orders">
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
              <TableCell>
                <Badge tone={order.tone}>{order.status}</Badge>
              </TableCell>
              <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  )
}
