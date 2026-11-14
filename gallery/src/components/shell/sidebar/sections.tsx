import { AppBrand, Sidebar } from 'ioiti-ui'
import type { SidebarSection } from 'ioiti-ui'
import { Boxes, ChartColumn, CreditCard, LayoutDashboard, Receipt, Truck, Users } from 'lucide-react'
import { useState } from 'react'

// Without an href, an entry is a button: onActiveChange says which was chosen.
const SECTIONS: SidebarSection[] = [
  {
    id: 'work',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      {
        id: 'orders',
        label: 'Orders',
        icon: <Receipt />,
        badge: 38,
        children: [
          { id: 'open', label: 'Open', badge: 12 },
          { id: 'returns', label: 'Returns', badge: '2 late', badgeTone: 'negative' },
          { id: 'archived', label: 'Archived' },
        ],
      },
      { id: 'deliveries', label: 'Deliveries', icon: <Truck />, badge: 'Delayed', badgeTone: 'warning' },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    foldable: true,
    items: [
      { id: 'sales', label: 'Sales', icon: <ChartColumn />, badge: 3 },
      { id: 'stock', label: 'Stock', icon: <Boxes /> },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      { id: 'team', label: 'Team', icon: <Users /> },
      { id: 'billing', label: 'Billing', icon: <CreditCard /> },
    ],
  },
]

/** Every entry, its children too: what the readout names. */
const ENTRIES = SECTIONS.flatMap((section) => section.items.flatMap((item) => [item, ...(item.children ?? [])]))

export default function SidebarSections() {
  const [active, setActive] = useState('returns')
  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* As tall as a frame, as wide as the sidebar: its Collapse button folds it. */}
      <div className="flex h-[28rem] overflow-hidden rounded-xl border border-border">
        <Sidebar sections={SECTIONS} activeId={active} onActiveChange={setActive} header={<AppBrand name="My App" detail="v1.2.0" />} />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Shown: <span className="font-medium text-foreground">{ENTRIES.find((entry) => entry.id === active)?.label}</span>
      </p>
    </div>
  )
}
