import { AdvancedDataTable, Badge, CodeBlock, formatMoney } from 'ioiti-ui'
import type { ColumnDef, DataTableState } from 'ioiti-ui'
import { useState } from 'react'

import { ORDERS, STATUS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

const COLUMNS: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order', accessorKey: 'id', sortable: true, cell: ({ value }) => <span className="font-mono">{value}</span> },
  { id: 'customer', header: 'Customer', accessorKey: 'customer', sortable: true },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    filterable: true,
    filterOptions: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
    cell: ({ row }) => <Badge tone={STATUS[row.status].tone}>{STATUS[row.status].label}</Badge>,
  },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', sortable: true, align: 'right', cell: ({ value }) => <span className="tabular-nums">{formatMoney(value, 'EUR')}</span> },
]

export default function DataTableHeldState() {
  // As a page reads it from its address: the late and open orders, the largest first.
  const [state, setState] = useState<DataTableState>({
    search: '',
    filters: { status: ['open', 'late'] },
    sort: { column: 'amount', direction: 'desc' },
    page: 1,
  })
  return (
    <div className="space-y-4">
      <AdvancedDataTable
        title="Orders"
        searchPlaceholder="Find an order or a customer"
        data={ORDERS}
        columns={COLUMNS}
        getRowId={(order) => order.id}
        defaultPageSize={5}
        selectable={false}
        state={state}
        onStateChange={setState}
      />
      <CodeBlock language="json" label="The state the page holds" code={JSON.stringify(state, null, 2)} />
    </div>
  )
}
