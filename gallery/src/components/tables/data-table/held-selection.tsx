import { AdvancedDataTable, Badge, formatMoney } from 'ioiti-ui'
import type { ColumnDef } from 'ioiti-ui'
import { Send } from 'lucide-react'
import { useState } from 'react'

import { ORDERS, STATUS } from '../../../samples/tables'
import type { Order } from '../../../samples/tables'

const COLUMNS: ColumnDef<Order>[] = [
  { id: 'id', header: 'Order', accessorKey: 'id', cell: ({ value }) => <span className="font-mono">{value}</span> },
  { id: 'customer', header: 'Customer', accessorKey: 'customer' },
  { id: 'status', header: 'Status', accessorKey: 'status', cell: ({ row }) => <Badge tone={STATUS[row.status].tone}>{STATUS[row.status].label}</Badge> },
  { id: 'amount', header: 'Amount', accessorKey: 'amount', align: 'right', cell: ({ value }) => <span className="tabular-nums">{formatMoney(value, 'EUR')}</span> },
]

export default function DataTableHeldSelection() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set(['2026-0042']))
  return (
    <div className="space-y-3">
      <AdvancedDataTable
        title="Orders to send"
        searchPlaceholder="Find an order or a customer"
        data={ORDERS}
        columns={COLUMNS}
        getRowId={(order) => order.id}
        defaultPageSize={5}
        rowLabel={(order) => `order ${order.id}`}
        isRowSelectable={(order) => order.status !== 'sent'}
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        selectionBasket={{
          noun: ['order', 'orders'],
          actions: [{ id: 'send', label: 'Send', icon: <Send className="size-3.5" />, variant: 'primary', onClick: () => setSelected(new Set()) }],
        }}
      />
      <p className="text-sm text-muted-foreground">
        Selected: <span className="font-mono text-foreground">{selected.size ? [...selected].join(', ') : 'none'}</span>
      </p>
    </div>
  )
}
