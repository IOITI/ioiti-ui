import { Badge, DataTable, DataTableContent, DataTableFilters, DataTablePagination, DataTableToolbar, useFormat } from 'ioiti-ui'
import type { ColumnDef } from 'ioiti-ui'

import { ORDERS, STATUS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

// The columns are made once, outside the page: the amount's cell is a component, which writes it in the
// application's locale.
function Amount({ value }: { value: number }) {
  const { formatMoney } = useFormat()
  return <span className="tabular-nums">{formatMoney(value, 'EUR')}</span>
}

const COLUMNS: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order', accessorKey: 'id', sortable: true, cell: ({ value }) => <span className="font-mono">{value}</span> },
  { id: 'customer', header: 'Customer', accessorKey: 'customer', sortable: true },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    filterable: true,
    // Always a list to tick, even for few options.
    filterDisplay: 'list',
    filterOptions: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
    cell: ({ row }) => <Badge tone={STATUS[row.status].tone}>{STATUS[row.status].label}</Badge>,
  },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', sortable: true, align: 'right', cell: ({ value }) => <Amount value={value} /> },
  // Not shown until it is picked in the list of columns.
  { id: 'placed', header: 'Placed', accessorKey: 'placed', defaultHidden: true },
]

export default function DataTableParts() {
  return (
    <DataTable data={ORDERS} columns={COLUMNS} getRowId={(order) => order.id} defaultPageSize={3} selectable={false}>
      <DataTableToolbar title="Orders" searchPlaceholder="Find an order" />
      <DataTableFilters />
      <DataTablePagination pageSizeOptions={[3, 6, 10]} />
      <DataTableContent emptyTitle="No order yet" />
    </DataTable>
  )
}
