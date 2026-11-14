import { AdvancedDataTable, Badge, formatMoney } from 'ioiti-ui'
import type { ColumnDef } from 'ioiti-ui'
import { GitCompare } from 'lucide-react'

import { CHANNEL, ORDERS, STATUS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

// The customers as a filter: nine, a list with a search of its own.
const CUSTOMERS = [...new Set(ORDERS.map((order) => order.customer))].sort().map((customer) => ({ label: customer, value: customer }))

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

export default function DataTableOrders() {
  return (
    <AdvancedDataTable
      title="Orders"
      data={ORDERS}
      columns={COLUMNS}
      getRowId={(order) => order.id}
      defaultPageSize={5}
      searchPlaceholder="Find an order or a customer"
      rowLabel={(order) => `order ${order.id}`}
      renderSubComponent={(order) => (
        <p className="text-sm text-muted-foreground">
          Placed on {order.placed} by {order.customer}, {CHANNEL[order.channel].toLowerCase()}.
        </p>
      )}
      selectionBasket={{
        noun: ['order', 'orders'],
        actions: [{ id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: '/components/tables/smart-comparison' }],
      }}
    />
  )
}
