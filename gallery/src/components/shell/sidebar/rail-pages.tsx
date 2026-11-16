import { AppBrand, Sidebar } from 'ioiti-ui'
import type { SidebarSection } from 'ioiti-ui'
import { BookOpen, LayoutDashboard, Receipt, Settings } from 'lucide-react'
import { useState } from 'react'

// Orders' first page, Open, is at its own address: the flyout lists it once. Settings is a page of its own, listed
// first in its flyout. Documentation is at the foot, above Collapse.
const SECTIONS: SidebarSection[] = [
  {
    id: 'work',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, href: '#/' },
      {
        id: 'orders',
        label: 'Orders',
        icon: <Receipt />,
        href: '#/orders',
        children: [
          { id: 'open', label: 'Open', href: '#/orders', badge: 12 },
          { id: 'returns', label: 'Returns', href: '#/orders?tab=returns', badge: '2 late', badgeTone: 'negative' },
          { id: 'archived', label: 'Archived', href: '#/orders?tab=archived' },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings />,
        href: '#/settings',
        children: [
          { id: 'team', label: 'Team', href: '#/settings/team' },
          { id: 'billing', label: 'Billing', href: '#/settings/billing' },
        ],
      },
    ],
  },
  { id: 'foot', place: 'footer', items: [{ id: 'docs', label: 'Documentation', icon: <BookOpen />, href: '#/docs' }] },
]

export default function SidebarRailPages() {
  const [collapsed, setCollapsed] = useState(true)
  return (
    // As tall as a frame: folded, an entry with pages under it shows them beside it; its Collapse button unfolds it.
    <div className="flex h-[28rem] overflow-hidden rounded-xl border border-border">
      <Sidebar
        sections={SECTIONS}
        activeId="returns"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<AppBrand name="My App" detail="v1.2.0" />}
      />
    </div>
  )
}
