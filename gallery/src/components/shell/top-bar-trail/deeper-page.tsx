import { isPlainClick, LinkProvider, PageHeader, PageTrailProvider, SegmentedControl, TopBarTrail, useNavigateTo } from 'ioiti-ui'
import type { Crumb, Menu } from 'ioiti-ui'
import { LayoutDashboard, Receipt, Users } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: ['Work', 'Settings'],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', icon: <Receipt /> },
    { id: 'returns', path: '/orders/returns', label: 'Returns', section: 'Work', parent: 'orders' },
    { id: 'team', path: '/settings/team', label: 'Team', section: 'Settings', icon: <Users /> },
  ],
}

/** Each page's header: the title of a page deeper than the menu ends the trail, after its parents. */
const PAGES: Record<string, { title: string; description: string; parents?: Crumb[] }> = {
  '/': { title: 'Dashboard', description: 'Home itself: nothing comes after it.' },
  '/orders': { title: 'Orders', description: 'An entry of the menu: its section, then itself.' },
  '/orders/returns': { title: 'Returns', description: 'An entry under another: the trail goes through it.' },
  '/orders/november': { title: 'November', description: 'The orders of a month, a page deeper than the menu.' },
  '/orders/2026-0042': {
    title: 'Order 2026-0042',
    description: 'Deeper than the menu: the pages between, then its own name.',
    parents: [{ label: 'November', href: '/orders/november' }],
  },
  '/settings/team': { title: 'Team', description: 'Another section.' },
}

const ADDRESSES = [
  { value: '/', label: 'Home' },
  { value: '/orders', label: 'Orders' },
  { value: '/orders/returns', label: 'Returns' },
  { value: '/orders/2026-0042', label: 'An order' },
]

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

export default function TopBarTrailDeeperPage() {
  const [pathname, setPathname] = useState('/orders/2026-0042')
  const navigate = useCallback((to: string | number) => {
    if (typeof to === 'string') setPathname(to)
  }, [])
  const page = PAGES[pathname] ?? { title: 'Page not found', description: 'No page at this address.' }
  return (
    <LinkProvider component={ExampleLink} navigate={navigate}>
      <div className="flex flex-col gap-4">
        <SegmentedControl className="self-start" label="The page shown" size="sm" options={ADDRESSES} value={pathname} onChange={setPathname} />
        {/* AppShell holds one: the menu, and the address of the page shown. */}
        <PageTrailProvider menu={MENU} pathname={pathname}>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex h-14 items-center border-b border-border px-4 glass-bar">
              <TopBarTrail />
            </div>
            <div className="p-4 sm:p-6">
              {/* It gives the trail its name, and its parents. */}
              <PageHeader title={page.title} description={page.description} parents={page.parents} />
            </div>
          </div>
        </PageTrailProvider>
        <p className="text-sm text-muted-foreground">
          Address: <span className="font-mono text-foreground">{pathname}</span>
        </p>
      </div>
    </LinkProvider>
  )
}
