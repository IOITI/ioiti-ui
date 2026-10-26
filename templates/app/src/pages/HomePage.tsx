import {
  Badge,
  ButtonLink,
  formatDay,
  formatMoney,
  KpiGrid,
  KpiTile,
  Meter,
  PageHeader,
  Panel,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'ioiti-ui'
import { ArrowRight } from 'lucide-react'

import { ITEMS, STATUS_LABEL } from '../data'

export function HomePage() {
  const open = ITEMS.filter((item) => item.status !== 'done')
  const total = ITEMS.reduce((sum, item) => sum + item.amount, 0)
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What needs attention today (example data)."
        actions={
          <ButtonLink to="/items" variant="outline" size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
            All items
          </ButtonLink>
        }
      />

      <KpiGrid>
        <KpiTile label="Open items" value={open.length} hint={`of ${ITEMS.length} this month`} />
        <KpiTile label="Total amount" value={formatMoney(total, 'EUR')} hint="Every item of the month" />
        <KpiTile label="Budget used" value="62%" hint="of 16,000.00 €">
          <Meter ratio={0.62} tone="warning" label="Budget used" scale={['0', '16,000 €']} />
        </KpiTile>
        <KpiTile label="Sync" value={<StatusBadge status="ok" />} hint="Last run at 09:30" />
      </KpiGrid>

      <Panel title="Latest items" description="The five changed last." dense>
        <Table className="min-w-[36rem]" aria-label="Latest items">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Item</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell numeric>Amount</TableHeaderCell>
              <TableHeaderCell numeric>Updated</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ITEMS.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell>
                  <Badge tone={item.status === 'done' ? 'success' : item.status === 'review' ? 'warning' : 'neutral'}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </TableCell>
                <TableCell numeric>{formatMoney(item.amount, 'EUR')}</TableCell>
                <TableCell numeric>{formatDay(item.updated, false)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </>
  )
}
