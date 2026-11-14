import { CodeBlock, ResizableHandle, ResizablePanel, ResizablePanels, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'ioiti-ui'
import { useState } from 'react'

const ROWS = [
  { customer: 'Acme', orders: 38 },
  { customer: 'Globex', orders: 21 },
  { customer: 'Riverside Bakery', orders: 9 },
]

export default function ResizablePanelsOneOverTheOther() {
  const [sizes, setSizes] = useState([40, 60])
  return (
    <div className="flex flex-col gap-3">
      <ResizablePanels direction="vertical" onSizesChange={setSizes} className="h-80 rounded-xl border border-border">
        <ResizablePanel defaultSize={40} minSize={20} label="the query">
          <CodeBlock
            className="m-3"
            language="text"
            code={`select customer, count(*) as orders
from orders
where sent_on >= current_date - 30
group by customer
order by orders desc`}
          />
        </ResizablePanel>
        <ResizableHandle label="Resize the query and its results" />
        <ResizablePanel defaultSize={60} minSize={25} label="the results">
          <Table aria-label="Orders by customer, last 30 days">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell numeric>Orders</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.customer}>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell numeric>{row.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
      </ResizablePanels>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Query {Math.round(sizes[0])}%, results {Math.round(sizes[1])}%
      </p>
    </div>
  )
}
