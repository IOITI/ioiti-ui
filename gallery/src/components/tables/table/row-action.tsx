import { Button, formatMoney, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextLink } from 'ioiti-ui'
import { Check, Mail } from 'lucide-react'
import { useState } from 'react'

const INVOICES = [
  { id: 'INV-2210', customer: 'Atelier Brun', due: '2 Nov', amount: 1840 },
  { id: 'INV-2207', customer: 'Maison Vidal', due: '29 Oct', amount: 960.5 },
  { id: 'INV-2203', customer: 'Studio Nord', due: '24 Oct', amount: 4320 },
]

export default function TableRowAction() {
  const [reminded, setReminded] = useState<string[]>([])
  return (
    <Table aria-label="Unpaid invoices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Invoice</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Due</TableHeaderCell>
          <TableHeaderCell numeric>Amount</TableHeaderCell>
          <TableHeaderCell>
            <span className="sr-only">Actions</span>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {INVOICES.map((invoice) => {
          const done = reminded.includes(invoice.id)
          return (
            <TableRow key={invoice.id}>
              <TableCell>
                <TextLink to="/components/tables/description-list" variant="hover" className="font-mono">
                  {invoice.id}
                </TextLink>
              </TableCell>
              <TableCell className="font-medium text-foreground">{invoice.customer}</TableCell>
              <TableCell>{invoice.due}</TableCell>
              <TableCell numeric>{formatMoney(invoice.amount, 'EUR')}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {/* The button stays where it is (and the focus with it); what came of it is said beside it. */}
                {done && (
                  <span className="mr-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="size-3.5" aria-hidden />
                    Reminded
                  </span>
                )}
                <Button
                  size="xs"
                  variant="ghost"
                  leftIcon={<Mail />}
                  aria-label={`${done ? 'Remind again' : 'Remind'}: ${invoice.customer}, ${invoice.id}`}
                  onClick={() => setReminded([...reminded.filter((id) => id !== invoice.id), invoice.id])}
                >
                  {done ? 'Remind again' : 'Remind'}
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
