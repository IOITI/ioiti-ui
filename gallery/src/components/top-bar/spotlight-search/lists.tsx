import { Button, SpotlightSearch, useFormat } from 'ioiti-ui'
import type { SpotlightSearchItem } from 'ioiti-ui'
import { Building2, ChartColumn, ListTree, Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ORDERS } from '../../../samples/tables'

const CUSTOMERS = Array.from(new Set(ORDERS.map((order) => order.customer)))

export default function SpotlightSearchLists() {
  const [open, setOpen] = useState(false)
  const { formatMoney } = useFormat()
  // "Orders" and "Customers" hold lists of their own: chosen, the palette lists them, their title before the field.
  const items = useMemo<SpotlightSearchItem[]>(
    () => [
      {
        id: 'orders',
        title: 'Orders',
        category: 'Lists',
        description: `${ORDERS.length} this month`,
        icon: <Receipt />,
        placeholder: 'An order, a customer…',
        items: ORDERS.map((order) => ({
          id: `order-${order.id}`,
          title: `Order ${order.id}`,
          category: 'Orders',
          description: `${order.customer} · ${formatMoney(order.amount)}`,
          href: '/components/tables',
          icon: <Receipt />,
        })),
      },
      {
        id: 'customers',
        title: 'Customers',
        category: 'Lists',
        description: `${CUSTOMERS.length} this month`,
        icon: <Building2 />,
        placeholder: 'A customer…',
        items: CUSTOMERS.map((customer) => ({
          id: `customer-${customer}`,
          title: customer,
          category: 'Customers',
          description: `${ORDERS.filter((order) => order.customer === customer).length} orders`,
          href: '/components/tables',
          icon: <Building2 />,
        })),
      },
      { id: 'charts', title: 'Charts', category: 'Pages', href: '/components/charts', icon: <ChartColumn />, shortcut: 'g c' },
    ],
    [formatMoney],
  )
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" leftIcon={<ListTree />} onClick={() => setOpen(true)}>
        Go to…
      </Button>
      <span className="text-sm text-muted-foreground">Choose Orders: its list opens; Backspace in the empty field goes back.</span>
      <SpotlightSearch open={open} onOpenChange={setOpen} label="Go to" placeholder="A list, a page…" grouped items={items} />
    </div>
  )
}
