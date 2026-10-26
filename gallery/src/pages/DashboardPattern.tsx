import {
  AirportMatrixClock,
  Badge,
  Button,
  formatMoney,
  KpiGrid,
  KpiTile,
  Meter,
  PageHeader,
  Panel,
  SignedValue,
  StatCard,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextLink,
} from 'ioiti-ui'
import type { HealthStatus } from 'ioiti-ui'

import { Demo } from '../parts'

// Example records: a page made the way the design's pages are.
const OPEN = [
  { id: '2026-0042', customer: 'Acme', items: 3, amount: 1840, change: 4.2, placed: '09:12' },
  { id: '2026-0037', customer: 'Hooli', items: 1, amount: 128.9, change: -1.3, placed: '08:47' },
  { id: '2026-0035', customer: 'Initech', items: 12, amount: 4320, change: 0, placed: '08:05' },
]

const EVENTS = [
  { what: 'Order 2026-0042 paid', when: '09:13', tone: 'success' as const },
  { what: 'Import of the price list', when: '09:00', tone: 'neutral' as const },
  { what: 'Payment refused (2026-0039)', when: '08:51', tone: 'danger' as const },
]

const SERVICES: { name: string; status: HealthStatus; detail: string }[] = [
  { name: 'Website', status: 'ok', detail: 'Answered in 120 ms' },
  { name: 'Payments', status: 'ok', detail: 'Last payment 2 min ago' },
  { name: 'Mail', status: 'warning', detail: '12 waiting to be sent' },
  { name: 'Nightly backup', status: 'disabled', detail: 'Switched off' },
]

export function DashboardPattern() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What a dashboard looks like, made of the package's blocks (example data)."
        actions={
          <>
            <div className="hidden sm:block">
              <AirportMatrixClock
                size="sm"
                title={null}
                cities={[
                  { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
                  { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
                ]}
              />
            </div>
            <Button size="sm" variant="outline">
              Pause the imports
            </Button>
          </>
        }
      />

      <KpiGrid>
        <StatCard
          label="Today"
          value={4210}
          trend={[0, 640, 1380, 2150, 2900, 3580, 4210]}
          previous={3890}
          period="vs last Monday"
          format={(value) => formatMoney(value, 'EUR')}
          toneOf={(value) => (value > 0 ? 'text-positive' : undefined)}
        />
        <KpiTile
          label="Orders today"
          value={
            <>
              3 <span className="text-base font-normal text-muted-foreground">of 10</span>
            </>
          }
          hint="The day's limit"
        >
          <Meter ratio={0.3} label="Orders of the day's limit" scale={['0', '10']} />
        </KpiTile>
        <KpiTile label="Returns" value="2.1%" hint="Under 5 %">
          <Meter ratio={0.42} tone="positive" label="Returns against their limit" scale={['0', '5 %']} />
        </KpiTile>
        <KpiTile label="Next import" value={<span className="text-positive">Open</span>} hint="At 12:00, in 2 h 48" />
      </KpiGrid>

      <Panel title="Open orders" description="Placed today, not sent yet." action={<TextLink to="/components/data" variant="quiet">All orders</TextLink>} dense>
        {/* On a phone, what matters first without scrolling sideways. */}
        <ul className="divide-y divide-border/40 text-xs sm:hidden">
          {OPEN.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0 truncate font-medium">{order.customer}</span>
              <span className="tabular-nums">{formatMoney(order.amount, 'EUR')}</span>
            </li>
          ))}
        </ul>
        <Table wrapperClassName="hidden sm:block" className="min-w-[40rem]" aria-label="Open orders">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell numeric>Items</TableHeaderCell>
              <TableHeaderCell numeric>Amount</TableHeaderCell>
              <TableHeaderCell>Placed</TableHeaderCell>
              <TableHeaderCell numeric>Against last week</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OPEN.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="max-w-[18rem] truncate font-medium">{order.customer}</TableCell>
                <TableCell>
                  <TextLink to="/components/data" variant="hover" className="font-mono">
                    {order.id}
                  </TextLink>
                </TableCell>
                <TableCell numeric>{order.items}</TableCell>
                <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
                <TableCell>{order.placed}</TableCell>
                <TableCell numeric>
                  <SignedValue value={order.change} kind="percent" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Latest events" dense>
          <ul className="divide-y divide-border/40 text-xs">
            {EVENTS.map((event) => (
              <li key={event.what} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <Badge tone={event.tone} dot>
                    {event.tone === 'danger' ? 'Refused' : event.tone === 'success' ? 'Done' : 'Info'}
                  </Badge>
                  <span className="truncate">{event.what}</span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{event.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Services" dense>
          <ul className="divide-y divide-border/40 text-xs">
            {SERVICES.map((service) => (
              <li key={service.name} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="font-medium">{service.name}</span>
                  <span className="block truncate text-muted-foreground">{service.detail}</span>
                </span>
                <StatusBadge status={service.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Demo
        id="text-link"
        title="TextLink"
        description="A link made of words, through the application's router: underlined in text, underlined under the pointer in a list, quiet as a panel's way further."
        names={['TextLink']}
      >
        <p className="text-sm">
          Read <TextLink to="/foundations/usable-by-all">the rules</TextLink> before writing a page.
        </p>
        <TextLink to="/components/data" variant="hover" className="text-sm font-medium">
          Order 2026-0042
        </TextLink>
        <TextLink to="/components/data" variant="quiet">
          View all
        </TextLink>
      </Demo>
    </>
  )
}
