import { ButtonLink, EmptyState, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'
import { FileText } from 'lucide-react'

export default function TableEmpty() {
  return (
    <Table aria-label="Unpaid invoices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Invoice</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Due</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>
            <EmptyState
              compact
              icon={<FileText />}
              title="No unpaid invoice"
              description="Every invoice of the last 90 days is paid."
              actions={
                <ButtonLink to="/components/tables/data-table" size="sm" variant="outline">
                  All invoices
                </ButtonLink>
              }
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
