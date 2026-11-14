import { EmptyText, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

export default function EmptyTextInATable() {
  return (
    <Table aria-label="Refunds">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Refund</TableHeaderCell>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3}>
            <EmptyText className="py-4">No refund this month.</EmptyText>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
