import { PeekLink, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

const INVOICES = [
  { id: '2026-0042', customer: 'Acme', due: '30 Oct', amount: '1,840.00 €', lines: 3 },
  { id: '2026-0041', customer: 'Globex', due: '28 Oct', amount: '960.50 €', lines: 2 },
  { id: '2026-0040', customer: 'Initech', due: '21 Oct', amount: '312.00 €', lines: 1 },
]

export default function PeekLinkInATable() {
  return (
    <Table aria-label="Invoices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Invoice</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              {/* Read when the card opens: a few lines of the record, never all of it. */}
              <PeekLink
                to="/patterns/dashboard"
                className="font-mono text-xs underline-offset-2 hover:underline"
                content={() => (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Invoice {invoice.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.customer} · {invoice.lines} line{invoice.lines === 1 ? '' : 's'} · due on {invoice.due}
                    </p>
                    <p className="font-semibold tabular-nums">{invoice.amount}</p>
                  </div>
                )}
              >
                {invoice.id}
              </PeekLink>
            </TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell numeric>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
