import { AppBrand, Sidebar, SidebarFooterButton, Switch } from 'ioiti-ui'
import type { SidebarSection } from 'ioiti-ui'
import { Boxes, LayoutDashboard, LifeBuoy, Truck } from 'lucide-react'
import { useState } from 'react'

const SECTIONS: SidebarSection[] = [
  {
    id: 'warehouse',
    title: 'Warehouse',
    items: [
      { id: 'today', label: 'Today', icon: <LayoutDashboard /> },
      { id: 'stock', label: 'Stock', icon: <Boxes />, badge: 4 },
      { id: 'shipments', label: 'Shipments', icon: <Truck /> },
    ],
  },
]

export default function SidebarFolded() {
  const [collapsed, setCollapsed] = useState(true)
  const [active, setActive] = useState('stock')
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex h-[22rem] overflow-hidden rounded-xl border border-border">
        <Sidebar
          sections={SECTIONS}
          activeId={active}
          onActiveChange={setActive}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<AppBrand name="Depot" detail="Warehouse 3" />}
          footer={<SidebarFooterButton icon={<LifeBuoy />} label="Help" />}
        />
      </div>
      <Switch label="Folded" description="Its own Collapse button says the same" checked={collapsed} onChange={setCollapsed} />
    </div>
  )
}
