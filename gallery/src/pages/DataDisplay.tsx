import {
  AdvancedDataTable,
  AgentActivityHeader,
  AgentActivityItem,
  AgentActivityTimeline,
  AIAgentActivity,
  AirportMatrixClock,
  AnimatedNumber,
  Badge,
  Button,
  Code,
  CodeBlock,
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePagination,
  DataTableToolbar,
  DescriptionList,
  formatMoney,
  InteractiveTimeline,
  KpiGrid,
  KpiTile,
  Meter,
  PageHeader,
  RecoveryLedger,
  SignedValue,
  SmartComparison,
  StatCard,
  StatGrid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'ioiti-ui'
import type { AgentActivityItemData, ColumnDef } from 'ioiti-ui'
import { GitCompare } from 'lucide-react'
import { useState } from 'react'

import { Demo } from '../parts'

interface Order {
  id: string
  customer: string
  status: 'open' | 'sent' | 'late'
  amount: number
  placed: string
  channel: 'web' | 'shop'
}

// Example records.
const ORDERS: Order[] = [
  { id: '2026-0042', customer: 'Acme', status: 'open', amount: 1840, placed: '26 Oct', channel: 'web' },
  { id: '2026-0041', customer: 'Globex', status: 'sent', amount: 960.5, placed: '25 Oct', channel: 'shop' },
  { id: '2026-0040', customer: 'Initech', status: 'late', amount: 4320, placed: '21 Oct', channel: 'web' },
  { id: '2026-0039', customer: 'Umbrella', status: 'sent', amount: 415, placed: '20 Oct', channel: 'web' },
  { id: '2026-0038', customer: 'Acme', status: 'sent', amount: 2750, placed: '17 Oct', channel: 'shop' },
  { id: '2026-0037', customer: 'Hooli', status: 'open', amount: 128.9, placed: '16 Oct', channel: 'web' },
  { id: '2026-0036', customer: 'Stark', status: 'sent', amount: 5200, placed: '14 Oct', channel: 'shop' },
  { id: '2026-0035', customer: 'Wayne', status: 'late', amount: 890, placed: '12 Oct', channel: 'web' },
  { id: '2026-0034', customer: 'Wonka', status: 'sent', amount: 74.2, placed: '10 Oct', channel: 'shop' },
  { id: '2026-0033', customer: 'Tyrell', status: 'open', amount: 1260, placed: '9 Oct', channel: 'web' },
]

// The customers as a filter: nine, a list with a search of its own.
const CUSTOMERS = [...new Set(ORDERS.map((order) => order.customer))].sort().map((customer) => ({ label: customer, value: customer }))
const CHANNEL = { web: 'Online', shop: 'In shop' } as const

const STATUS = { open: { label: 'Open', tone: 'neutral' }, sent: { label: 'Sent', tone: 'success' }, late: { label: 'Late', tone: 'danger' } } as const

const COLUMNS: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order', accessorKey: 'id', sortable: true, cell: ({ value }) => <span className="font-mono">{value}</span> },
  { id: 'customer', header: 'Customer', accessorKey: 'customer', sortable: true, filterable: true, filterOptions: CUSTOMERS },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    filterable: true,
    filterOptions: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
    cell: ({ row }) => (
      <Badge tone={STATUS[row.status].tone} dot>
        {STATUS[row.status].label}
      </Badge>
    ),
  },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', sortable: true, align: 'right', cell: ({ value }) => <span className="tabular-nums">{formatMoney(value, 'EUR')}</span> },
  { id: 'placed', header: 'Placed', accessorKey: 'placed', priority: 'low' },
  // Two options: an on/off pair, labels that say themselves.
  {
    id: 'channel',
    header: 'Channel',
    accessorKey: 'channel',
    priority: 'low',
    filterable: true,
    filterOptions: Object.entries(CHANNEL).map(([value, label]) => ({ value, label })),
    cell: ({ row }) => CHANNEL[row.channel],
  },
]

const ACTIVITY: AgentActivityItemData[] = [
  { id: 'a1', type: 'thinking', title: 'Read the question', status: 'success', statusLabel: 'Done', duration: '0.4 s', timestamp: '09:31:02' },
  { id: 'a2', type: 'database_query', title: 'Orders of October', status: 'success', statusLabel: 'Done', duration: '1.2 s', timestamp: '09:31:03', details: { input: { month: '2026-10' }, output: '42 orders' } },
  { id: 'a3', type: 'writing', title: 'The summary', status: 'running', statusLabel: 'Running', timestamp: '09:31:05' },
]

function Rolling() {
  const [value, setValue] = useState(12.4)
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SignedValue value={value} kind="percent" animate className="text-2xl font-semibold" />
      <SignedValue value={value * 34.2} kind="money" className="text-sm" />
      <AnimatedNumber value={Math.round(value * 100)} useGrouping className="text-2xl font-semibold" />
      <Button size="sm" variant="outline" onClick={() => setValue((current) => Math.round((current + (Math.random() - 0.55) * 20) * 100) / 100)}>
        Change it
      </Button>
    </div>
  )
}

export function DataDisplay() {
  return (
    <>
      <PageHeader title="Data display" description="Records and figures: tables that scroll in their own frame, tiles for what a page is about, digits of one width." />

      <Demo
        id="table"
        title="Table"
        description="The plain table of the pages, in two densities. Compact for records in a panel (12 px, rows apart by a line); dense for figures side by side (14 px, narrow cells). Figures go right, in digits of one width."
        names={['Table', 'TableHead', 'TableBody', 'TableRow', 'TableHeaderCell', 'TableCell']}
        className="flex flex-col items-stretch gap-6"
      >
        <Table className="min-w-[36rem]" aria-label="Latest orders">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell numeric>Amount</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ORDERS.slice(0, 4).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-muted-foreground">{order.id}</TableCell>
                <TableCell className="font-medium text-foreground">{order.customer}</TableCell>
                <TableCell>
                  <Badge tone={STATUS[order.status].tone}>{STATUS[order.status].label}</Badge>
                </TableCell>
                <TableCell numeric>{formatMoney(order.amount, 'EUR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table density="dense" aria-label="Orders by week">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Week</TableHeaderCell>
              <TableHeaderCell numeric>Orders</TableHeaderCell>
              <TableHeaderCell numeric>Amount</TableHeaderCell>
              <TableHeaderCell numeric>Change</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['Week 41', 38, 21480, 4.2],
              ['Week 42', 41, 23950, 11.5],
              ['Week 43', 36, 19870, -17],
            ].map(([week, orders, amount, change]) => (
              <TableRow key={week}>
                <TableHeaderCell>{week}</TableHeaderCell>
                <TableCell numeric>{orders}</TableCell>
                <TableCell numeric>{formatMoney(amount as number, 'EUR')}</TableCell>
                <TableCell numeric>
                  <SignedValue value={change as number} kind="percent" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>

      <Demo
        id="advanced-table"
        title="AdvancedDataTable"
        description="Records to search, sort, filter and open: below 640 px its rows become cards. Its filters are one group of buttons: a list to tick for each column, each option with the rows it would leave (a search past seven of them), and two options as an on/off pair. A selection shows the basket of what can be done with it."
        names={['AdvancedDataTable']}
        className="block w-full"
      >
        <AdvancedDataTable
          title="Orders"
          data={ORDERS}
          columns={COLUMNS}
          getRowId={(order) => order.id}
          defaultPageSize={5}
          searchPlaceholder="Find an order or a customer"
          rowLabel={(order) => `order ${order.id}`}
          renderSubComponent={(order) => <p className="text-sm text-muted-foreground">Placed on {order.placed} by {order.customer}.</p>}
          selectionBasket={{
            noun: ['order', 'orders'],
            actions: [{ id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '/components/data' }],
          }}
        />
      </Demo>

      <Demo
        id="data-table-parts"
        title="DataTable, in parts"
        description="The same table composed from its parts, for a page that puts its toolbar or its paging elsewhere."
        names={['DataTable', 'DataTableToolbar', 'DataTableFilters', 'DataTableContent', 'DataTablePagination']}
        className="block w-full"
      >
        <DataTable data={ORDERS} columns={COLUMNS} getRowId={(order) => order.id} defaultPageSize={3} selectable={false}>
          <DataTableToolbar title="Orders" />
          <DataTableFilters />
          <DataTableContent />
          <DataTablePagination />
        </DataTable>
      </Demo>

      <Demo
        id="description-list"
        title="DescriptionList"
        description="Terms and their details: a summary in rows, a record's details with its terms in a column, figures side by side, facts in a line. Its terms in the secondary text, their details in the primary one; figures line up."
        names={['DescriptionList']}
        className="grid w-full gap-8 lg:grid-cols-2"
      >
        <DescriptionList
          boxed
          numeric
          items={[
            { term: 'Subtotal', details: formatMoney(1533.33) },
            { term: 'Tax', details: formatMoney(306.67) },
            { term: 'Total', details: formatMoney(1840) },
          ]}
        />
        <DescriptionList
          layout="columns"
          termWidth="9rem"
          items={[
            { term: 'Reference', details: 'IT-1042' },
            { term: 'Customer', details: 'Atelier Brun, Lyon' },
            { term: 'Delivery', details: 'By courier, before noon' },
            { term: 'Notes', details: 'Leave the parcel at the reception desk; the door code changes on Mondays.' },
          ]}
        />
        <DescriptionList
          layout="grid"
          columns={3}
          numeric
          items={[
            { term: 'Orders', details: '1,284' },
            { term: 'Returned', details: '38' },
            { term: 'Median delivery', details: '2.4 days' },
          ]}
        />
        <DescriptionList
          layout="inline"
          compressed
          items={[
            { term: 'Placed', details: '26 Oct' },
            { term: 'Lines', details: '4' },
            { term: 'Paid by', details: 'Card' },
          ]}
        />
      </Demo>

      <Demo
        id="code"
        title="CodeBlock and Code"
        description="Code to read and copy (a payload, a configuration, a command), coloured in the design's code colours, each 4.5:1 on its surface in every look: json, js and ts, css, a shell. Its lines numbered, some marked, a long one scrolled or wrapped; inline, a word of code in a sentence."
        names={['CodeBlock', 'Code']}
        className="grid w-full gap-4 lg:grid-cols-2"
      >
        <CodeBlock
          label="Order IT-1042, as the server sent it"
          language="json"
          lineNumbers
          highlightLines={[4]}
          code={`{
  "id": "IT-1042",
  "customer": "Atelier Brun",
  "status": "paid",
  "total": 1840,
  "lines": 4,
  "gift": false
}`}
        />
        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock language="shell" code={'npm install github:IOITI/ioiti-ui#v0.3.0 react react-dom framer-motion\nnpm run dev -- --port 5180'} />
          <CodeBlock
            language="ts"
            label="order.ts"
            code={`export function late(order: Order, now = Date.now()) {
  return now - Date.parse(order.promisedAt) > 2 * DAY
}`}
          />
          <p className="text-sm text-muted-foreground">
            A toast is shown with <Code>useToast()</Code>, and leaves on its own after <Code>4 s</Code>.
          </p>
        </div>
      </Demo>

      <Demo
        id="kpi"
        title="KpiTile, KpiGrid and Meter"
        description="The figures a page is about, four across from 1280 px, two on a phone. A meter is one ratio against a limit, its track a faint step of its own colour."
        names={['KpiGrid', 'KpiTile', 'Meter']}
        className="block w-full"
      >
        <KpiGrid>
          <KpiTile label="Orders today" value="12" hint="8 yesterday" />
          <KpiTile label="Amount" value={formatMoney(4210, 'EUR')} hint="Since midnight" />
          <KpiTile label="Storage" value="62%" hint="of 50 GB">
            <Meter ratio={0.62} tone="warning" label="Storage used" scale={['0', '50 GB']} />
          </KpiTile>
          <KpiTile label="Errors" value="0" hint="In the last hour">
            <Meter ratio={0.05} tone="positive" label="Error budget used" />
          </KpiTile>
        </KpiGrid>
      </Demo>

      <Demo
        id="stat-card"
        title="StatCard and StatGrid"
        description="A figure and its line: scrub the line (with the pointer or the arrows) to read a day. The change is shown only against what it is told it changes from."
        names={['StatCard', 'StatGrid']}
        className="block w-full"
      >
        <StatGrid>
          <StatCard
            label="Revenue"
            value={23950}
            trend={[18200, 19400, 21480, 20100, 23950]}
            trendLabels={['Week 39', 'Week 40', 'Week 41', 'Week 42', 'Week 43']}
            previous={21480}
            period="vs last week"
            format={(value) => formatMoney(value, 'EUR')}
          />
          <StatCard
            label="Average delivery"
            value={3.1}
            trend={[3.8, 3.6, 3.4, 3.3, 3.1]}
            delta={-6}
            goodWhen="down"
            period="days, vs last month"
            format={(value) => `${value.toFixed(1)} d`}
          />
        </StatGrid>
      </Demo>

      <Demo
        id="signed"
        title="SignedValue and AnimatedNumber"
        description="A change says its sign, and its colour repeats it. A figure that changes in front of the reader rolls its digits (plain text where motion is reduced)."
        names={['SignedValue', 'AnimatedNumber']}
      >
        <Rolling />
      </Demo>

      <Demo
        id="timeline"
        title="InteractiveTimeline"
        description="What happened to something, step by step, with its moments and figures."
        names={['InteractiveTimeline']}
        className="block w-full"
      >
        <InteractiveTimeline
          label="Order 2026-0042"
          defaultExpandedIds={['packed']}
          items={[
            { id: 'placed', title: 'Placed', timestamp: '26 Oct, 09:12', status: 'completed', description: 'By Ana Martins, from the website.' },
            { id: 'paid', title: 'Paid', timestamp: '26 Oct, 09:13', status: 'completed', metrics: [{ label: 'Amount', value: '1,840.00 €' }] },
            { id: 'packed', title: 'Being packed', timestamp: '26 Oct, 10:40', status: 'in-progress', statusLabel: 'Now', description: 'Three boxes.' },
            { id: 'sent', title: 'Sent', timestamp: '—', status: 'pending' },
          ]}
        />
      </Demo>

      <Demo
        id="ledger"
        title="RecoveryLedger"
        description="Versions of something, newest first: the current one marked, an earlier one opened on what restoring it would change. The page asks before restoring."
        names={['RecoveryLedger']}
        className="block w-full"
      >
        <RecoveryLedger
          title="Versions of the price list"
          currentEntryId="v3"
          entries={[
            { id: 'v3', action: 'Saved by Ana', description: 'Spring prices', timestamp: new Date(Date.now() - 3_600_000), reference: 'prices-v3.json' },
            { id: 'v2', action: 'Saved by Malik', description: 'Shipping to Spain', timestamp: new Date(Date.now() - 86_400_000), restorable: true, details: { content: <p className="text-xs">Restoring it changes 3 prices.</p> } },
            { id: 'v1', action: 'Imported', description: 'First list', timestamp: new Date(Date.now() - 7 * 86_400_000), restorable: true },
          ]}
        />
      </Demo>

      <Demo
        id="comparison"
        title="SmartComparison"
        description="Several things side by side, row by row, with the differences alone on demand; read by screen readers as a table."
        names={['SmartComparison']}
        className="block w-full"
      >
        <SmartComparison
          label="Plans compared"
          plans={[
            { id: 'solo', name: 'Solo', tagline: 'One user', price: '9 €', billingPeriod: 'a month' },
            { id: 'team', name: 'Team', tagline: 'Up to ten', price: '29 €', billingPeriod: 'a month', featured: true, badge: 'Chosen most' },
            { id: 'company', name: 'Company', tagline: 'Everyone', price: '99 €', billingPeriod: 'a month' },
          ]}
          categories={[
            {
              id: 'use',
              title: 'Use',
              features: [
                { id: 'users', name: 'Users', values: { solo: '1', team: '10', company: 'Unlimited' } },
                { id: 'storage', name: 'Storage', values: { solo: '5 GB', team: '50 GB', company: '1 TB' } },
                { id: 'export', name: 'Exports', values: { solo: true, team: true, company: true } },
                { id: 'sso', name: 'Single sign-on', values: { solo: false, team: false, company: true } },
              ],
            },
          ]}
        />
      </Demo>

      <Demo
        id="agent"
        title="AIAgentActivity"
        description="What an assistant did, step by step: each step's state in words beside its time, its input and output on demand. Composed from its parts, or whole."
        names={['AIAgentActivity', 'AgentActivityHeader', 'AgentActivityTimeline', 'AgentActivityItem']}
        className="block w-full"
      >
        <AIAgentActivity activities={ACTIVITY} isRunning summary="2 of 3 done" inputLabel="Asked" outputLabel="Answer">
          <AgentActivityHeader title="The October summary" agentName="Assistant" />
          <AgentActivityTimeline />
        </AIAgentActivity>
        <div className="mt-4 rounded-2xl border border-border/70">
          <AIAgentActivity activities={ACTIVITY.slice(0, 1)}>
            <AgentActivityItem activity={ACTIVITY[0]} isLast />
          </AIAgentActivity>
        </div>
      </Demo>

      <Demo id="clock" title="AirportMatrixClock" description="The time of a few cities, as a departures board: two of them fit beside a page's title." names={['AirportMatrixClock']}>
        <AirportMatrixClock
          title={null}
          cities={[
            { id: 'paris', name: 'Paris', timeZone: 'Europe/Paris' },
            { id: 'new-york', name: 'New York', timeZone: 'America/New_York' },
            { id: 'tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo' },
          ]}
        />
      </Demo>
    </>
  )
}
