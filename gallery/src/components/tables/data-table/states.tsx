import { AdvancedDataTable, formatMoney, SegmentedControl } from 'ioiti-ui'
import type { ColumnDef } from 'ioiti-ui'
import { useState } from 'react'

import { ORDERS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

const COLUMNS: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order', accessorKey: 'id', cell: ({ value }) => <span className="font-mono">{value}</span> },
  { id: 'customer', header: 'Customer', accessorKey: 'customer' },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', align: 'right', cell: ({ value }) => <span className="tabular-nums">{formatMoney(value, 'EUR')}</span> },
]

type Shown = 'rows' | 'loading' | 'failed' | 'empty'

export default function DataTableStates() {
  const [shown, setShown] = useState<Shown>('loading')
  return (
    <div className="space-y-4">
      <SegmentedControl<Shown>
        label="What the table has"
        size="sm"
        value={shown}
        onChange={setShown}
        options={[
          { value: 'rows', label: 'Rows' },
          { value: 'loading', label: 'Loading' },
          { value: 'failed', label: 'Failed' },
          { value: 'empty', label: 'Empty' },
        ]}
      />
      <AdvancedDataTable
        title="Orders"
        searchPlaceholder="Find an order"
        data={shown === 'empty' ? [] : ORDERS.slice(0, 3)}
        columns={COLUMNS}
        getRowId={(order) => order.id}
        selectable={false}
        isLoading={shown === 'loading'}
        error={shown === 'failed' ? 'The orders could not be read: the server did not answer. Try again in a minute.' : null}
        emptyTitle="No order yet"
        emptyDescription="Orders appear here as soon as the shop takes one."
      />
    </div>
  )
}
