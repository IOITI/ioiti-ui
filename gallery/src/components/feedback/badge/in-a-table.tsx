import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'
import type { BadgeTone } from 'ioiti-ui'

const INVOICES: { id: string; customer: string; amount: string; state: string; tone: BadgeTone }[] = [
  { id: '2026-0042', customer: 'Acme', amount: '1,840.00 €', state: 'Paid', tone: 'success' },
  { id: '2026-0041', customer: 'Globex', amount: '960.50 €', state: 'Due in 3 days', tone: 'warning' },
  { id: '2026-0040', customer: 'Initech', amount: '312.00 €', state: 'Overdue', tone: 'danger' },
  { id: '2026-0039', customer: 'Umbrella', amount: '75.00 €', state: 'Draft', tone: 'neutral' },
]

export default function BadgeInATable() {
  return (
    <Table aria-label="Invoices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Invoice</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>State</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              <Badge tone={invoice.tone}>{invoice.state}</Badge>
            </TableCell>
            <TableCell numeric>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
