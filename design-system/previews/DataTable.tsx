import { AdvancedDataTable, Badge, DataTable, DataTableContent, DataTableFilters, DataTablePagination, DataTableToolbar, formatMoney } from 'ioiti-ui'
import type { ColumnDef } from 'ioiti-ui'
import { GitCompare } from 'lucide-react'
import { createRoot } from 'react-dom/client'

interface Order {
  id: string
  customer: string
  status: 'open' | 'sent' | 'late'
  amount: number
  placed: string
  channel: 'web' | 'shop'
}

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

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col gap-6 p-5">
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
        actions: [{ id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '#compare' }],
      }}
    />
    <DataTable data={ORDERS} columns={COLUMNS} getRowId={(order) => order.id} defaultPageSize={3} selectable={false}>
      <DataTableToolbar title="Orders" />
      <DataTableFilters />
      <DataTableContent />
      <DataTablePagination />
    </DataTable>
  </div>,
)
