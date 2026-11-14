import { AppBrand, Sidebar, SidebarTrigger } from 'ioiti-ui'
import type { SidebarSection } from 'ioiti-ui'
import { CalendarDays, LayoutDashboard, Receipt, Users } from 'lucide-react'
import { useState } from 'react'

const SECTIONS: SidebarSection[] = [
  {
    id: 'work',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      { id: 'orders', label: 'Orders', icon: <Receipt />, badge: 38 },
      { id: 'planning', label: 'Planning', icon: <CalendarDays /> },
      { id: 'customers', label: 'Customers', icon: <Users /> },
    ],
  },
]

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('orders')
  return (
    <div className="flex h-[20rem] overflow-hidden rounded-xl border border-border">
      <Sidebar
        sections={SECTIONS}
        activeId={active}
        onActiveChange={setActive}
        header={<AppBrand name="My App" />}
        mobileOpen={open}
        onMobileOpenChange={setOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          {/* Below 768 px only, where the sidebar is not beside the page. */}
          <SidebarTrigger onClick={() => setOpen(true)} />
          <span className="truncate text-sm font-medium">{SECTIONS[0].items.find((item) => item.id === active)?.label}</span>
        </div>
        <p className="p-4 text-sm text-muted-foreground">
          On a phone, the button at the top opens the menu over the page; a choice closes it.
        </p>
      </div>
    </div>
  )
}
