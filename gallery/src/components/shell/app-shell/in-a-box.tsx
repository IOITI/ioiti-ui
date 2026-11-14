import { AppShell, isPlainClick, LinkProvider, PageHeader, SidebarFooterButton, StateChip, TextLink, useNavigateTo, useToast } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { ChartColumn, CreditCard, LayoutDashboard, LogOut, Package, Receipt, Truck, Users } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: [{ id: 'Work', title: false }, { id: 'Reports', foldable: true }, 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt />, badge: 38 },
    // Under Orders: listed under it in the sidebar, and the trail goes through it.
    { id: 'returns', path: '/orders/returns', label: 'Returns', section: 'Work', parent: 'orders', badge: 2 },
    { id: 'invoices', path: '/orders/invoices', label: 'Invoices', section: 'Work', parent: 'orders' },
    { id: 'deliveries', path: '/deliveries', label: 'Deliveries', section: 'Work', icon: <Truck />, badge: 'Delayed', badgeTone: 'warning' },
    { id: 'sales', path: '/reports/sales', label: 'Sales', section: 'Reports', icon: <ChartColumn />, badge: 3 },
    { id: 'stock', path: '/reports/stock', label: 'Stock', section: 'Reports', icon: <Package /> },
    { id: 'team', path: '/settings/team', label: 'Team', section: 'Settings', icon: <Users /> },
    { id: 'billing', path: '/settings/billing', label: 'Billing', section: 'Settings', icon: <CreditCard /> },
  ],
}

/**
 * The example's own link: its pages are an address it keeps, not the gallery's. A plain click follows it through
 * LinkProvider's `navigate`; with ⌘ or Ctrl, the browser opens it elsewhere. An application gives the router's.
 */
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

/** The pages, tiny: each names itself; Orders leads to one deeper than the menu. */
function Page({ pathname }: { pathname: string }) {
  if (pathname === '/orders/2026-0042') {
    return <PageHeader title="Order 2026-0042" description="Acme · 1,840.00 € · sent on 12 November." />
  }
  const entry = MENU.entries.find((each) => each.path === pathname)
  return (
    <>
      <PageHeader title={entry?.label ?? 'Page not found'} description="A page of the menu: its entry is marked, the trail ends with it." />
      {pathname === '/orders' && (
        <p className="text-sm text-muted-foreground">
          The latest: <TextLink to="/orders/2026-0042">Order 2026-0042</TextLink>, a page deeper than the menu.
        </p>
      )}
    </>
  )
}

export default function AppShellInABox() {
  const toast = useToast()
  const [pathname, setPathname] = useState('/orders')
  const navigate = useCallback((to: string | number) => {
    if (typeof to === 'string') setPathname(to)
  }, [])
  return (
    // Every link in it (the menu's, the trail's, the page's) changes the example's address, not the gallery's.
    <LinkProvider component={ExampleLink} navigate={navigate}>
      <div className="h-[28rem] overflow-hidden rounded-xl border border-border">
        <AppShell
          menu={MENU}
          pathname={pathname}
          appName="My App"
          appDetail="v1.2.0"
          className="h-full"
          shortcutsDialog={false}
          sidebarFooter={
            <SidebarFooterButton
              icon={<LogOut />}
              label="Sign out"
              onClick={() => toast({ title: 'Signed out', description: 'An application goes to its sign-in page.' })}
            />
          }
          topBarChips={
            pathname !== '/settings/billing' && (
              <StateChip
                to="/settings/billing"
                tone="warning"
                icon={<CreditCard className="size-3.5" aria-hidden />}
                label="Card expires soon"
                hint="The card on file expires on 30 November: the payments stop after it."
              />
            )
          }
        >
          <Page pathname={pathname} />
        </AppShell>
      </div>
    </LinkProvider>
  )
}
