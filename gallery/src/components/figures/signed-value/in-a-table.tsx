import { formatMoney, SignedValue, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'

const SHOPS = [
  { shop: 'Lyon', revenue: 21480, change: 1240.5, percent: 6.1 },
  { shop: 'Nantes', revenue: 14210, change: -860, percent: -5.7 },
  { shop: 'Lille', revenue: 9870, change: 0, percent: 0 },
  { shop: 'Bordeaux', revenue: 17320, change: 312.25, percent: 1.8 },
]

export default function SignedValueInATable() {
  return (
    <Table density="dense" aria-label="Revenue by shop, against last month">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Shop</TableHeaderCell>
          <TableHeaderCell numeric>Revenue</TableHeaderCell>
          <TableHeaderCell numeric>Change</TableHeaderCell>
          <TableHeaderCell numeric>In %</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {SHOPS.map((row) => (
          <TableRow key={row.shop}>
            <TableHeaderCell>{row.shop}</TableHeaderCell>
            <TableCell numeric>{formatMoney(row.revenue, 'EUR')}</TableCell>
            <TableCell numeric>
              <SignedValue value={row.change} kind="money" />
            </TableCell>
            <TableCell numeric>
              <SignedValue value={row.percent} kind="percent" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
