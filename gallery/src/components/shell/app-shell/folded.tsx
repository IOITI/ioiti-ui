import { AppShell, isPlainClick, LinkProvider, PageHeader, SidebarFooterButton, UserMenu, useNavigateTo, useToast } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { Boxes, LayoutDashboard, LifeBuoy, Truck, Warehouse } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: ['Warehouse'],
  trailSections: false,
  entries: [
    { id: 'today', path: '/', label: 'Today', section: 'Warehouse', icon: <LayoutDashboard /> },
    { id: 'stock', path: '/stock', label: 'Stock', section: 'Warehouse', icon: <Boxes />, badge: 4 },
    { id: 'shipments', path: '/shipments', label: 'Shipments', section: 'Warehouse', icon: <Truck /> },
  ],
}

/** The example's own link: a plain click changes its address (LinkProvider's `navigate`), not the gallery's. */
function ExampleLink({ href = '', onClick, ...props }: ComponentProps<'a'>) {
  const navigate = useNavigateTo()
  return (
    <a
      {...props}
      href={`#${href}`}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || !isPlainClick(event)) return
        event.preventDefault()
        navigate(href)
      }}
    />
  )
}

export default function AppShellFolded() {
  const toast = useToast()
  const [pathname, setPathname] = useState('/stock')
  const navigate = useCallback((to: string | number) => {
    if (typeof to === 'string') setPathname(to)
  }, [])
  const label = MENU.entries.find((entry) => entry.path === pathname)?.label ?? 'Page not found'
  return (
    <LinkProvider component={ExampleLink} navigate={navigate}>
      <div className="h-[22rem] overflow-hidden rounded-xl border border-border">
        <AppShell
          menu={MENU}
          pathname={pathname}
          appName="Depot"
          appDetail="Warehouse 3"
          brandMark={<Warehouse className="size-4" />}
          defaultCollapsed
          className="h-full"
          shortcutsDialog={false}
          sidebarFooter={<SidebarFooterButton icon={<LifeBuoy />} label="Help" onClick={() => toast({ title: 'Help is on its way' })} />}
          topBarEnd={<UserMenu name="Omar Haddad" detail="Shift lead" onSignOut={() => toast({ title: 'Signed out' })} />}
        >
          <PageHeader title={label} description="The sidebar folded to its rail: the page takes the room." />
        </AppShell>
      </div>
    </LinkProvider>
  )
}
