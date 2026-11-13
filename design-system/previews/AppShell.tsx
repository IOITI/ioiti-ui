import { AppShell, IconButton, KpiGrid, KpiTile, LinkProvider, PageHeader, Panel, SidebarFooterButton } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { Bell, LayoutDashboard, LogOut, Receipt, Settings, Users } from 'lucide-react'
import { forwardRef, useMemo, useState } from 'react'
import type { AnchorHTMLAttributes } from 'react'
import { createRoot } from 'react-dom/client'

const MENU: Menu = {
  sections: ['Work', 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
    { id: 'customers', path: '/customers', label: 'Customers', section: 'Work', icon: <Users /> },
    { id: 'settings', path: '/settings', label: 'Settings', section: 'Settings', icon: <Settings /> },
  ],
}

function Preview() {
  const [pathname, setPathname] = useState('/orders')
  // The frame has no router: a link changes the page shown here.
  const Link = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(function Link({ href, onClick, ...props }, ref) {
        return (
          <a
            ref={ref}
            href={href}
            onClick={(event) => {
              onClick?.(event)
              event.preventDefault()
              setPathname(href)
            }}
            {...props}
          />
        )
      }),
    [],
  )
  const entry = MENU.entries.find((each) => each.path === pathname) ?? MENU.entries[0]
  return (
    <LinkProvider component={Link} navigate={(to) => setPathname(String(to))}>
      <AppShell
        menu={MENU}
        pathname={pathname}
        appName="My App"
        appDetail="v1.2.0"
        sidebarFooter={<SidebarFooterButton icon={<LogOut />} label="Sign out" />}
        topBarEnd={<IconButton label="Notifications" icon={<Bell />} />}
      >
        <PageHeader title={entry.label} description="A page of the application, in the shell's column." />
        <KpiGrid columns={3}>
          <KpiTile label="Orders today" value="12" hint="8 yesterday" />
          <KpiTile label="Amount" value="4,210.00 €" hint="Since midnight" />
          <KpiTile label="Returns" value="3" hint="This week" />
        </KpiGrid>
        <Panel title="Open orders" description="Placed today, not sent yet.">
          <p className="text-sm text-muted-foreground">The page's blocks, 24 px apart.</p>
        </Panel>
      </AppShell>
    </LinkProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
