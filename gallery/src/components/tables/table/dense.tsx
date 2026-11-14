import { formatMoney, SignedValue, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

const WEEKS = [
  { week: 'Week 40', orders: 36, amount: 20610, change: -3.1 },
  { week: 'Week 41', orders: 38, amount: 21480, change: 4.2 },
  { week: 'Week 42', orders: 41, amount: 23950, change: 11.5 },
  { week: 'Week 43', orders: 36, amount: 19870, change: -17 },
  { week: 'Week 44', orders: 36, amount: 19870, change: 0 },
]

export default function TableDense() {
  return (
    <Table density="dense" aria-label="Orders by week">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Week</TableHeaderCell>
          <TableHeaderCell numeric>Orders</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
          <TableHeaderCell numeric>Against the week before</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {WEEKS.map((row) => (
          <TableRow key={row.week}>
            <TableHeaderCell>{row.week}</TableHeaderCell>
            <TableCell numeric>{row.orders}</TableCell>
            <TableCell numeric>{formatMoney(row.amount, 'EUR')}</TableCell>
            <TableCell numeric>
              <SignedValue value={row.change} kind="percent" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
