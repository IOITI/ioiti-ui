import { AnimatedTabs, AppShell, isPlainClick, LinkProvider, PageHeader, useNavigateTo } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { BookOpen, LayoutDashboard, Rocket } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ComponentProps } from 'react'

const MENU: Menu = {
  sections: [{ id: 'Work', title: false }, { id: 'Help', place: 'footer' }],
  entries: [
    { id: 'home', path: '/', label: 'Dashboard', section: 'Work', icon: <LayoutDashboard /> },
    // Deployments leads to its first page, Jobs, at its own address; History is the page's tab in the query.
    { id: 'deployments', path: '/ops', label: 'Deployments', section: 'Work', icon: <Rocket /> },
    { id: 'jobs', path: '/ops', label: 'Jobs', section: 'Work', parent: 'deployments' },
    { id: 'history', path: '/ops?tab=history', label: 'History', section: 'Work', parent: 'deployments' },
    // At the foot of the sidebar, above Collapse.
    { id: 'docs', path: '/docs', label: 'Documentation', section: 'Help', icon: <BookOpen /> },
  ],
}

/** The example's own link: its pages are an address it keeps, not the gallery's. */
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

export default function AppShellTabsAndFoot() {
  const [address, setAddress] = useState('/ops?tab=history')
  const navigate = useCallback((to: string | number) => {
    if (typeof to === 'string') setAddress(to)
  }, [])
  const [pathname, query = ''] = address.split('?')
  const search = query ? `?${query}` : ''
  return (
    <LinkProvider component={ExampleLink} navigate={navigate}>
      <div className="h-[28rem] overflow-hidden rounded-xl border border-border">
        <AppShell menu={MENU} pathname={pathname} search={search} appName="My App" className="h-full" shortcutsDialog={false}>
          {pathname === '/ops' ? (
            <>
              <PageHeader title="Deployments" description="Its tabs are in the query: the sidebar and the trail follow them." />
              <AnimatedTabs
                label="Deployments"
                tabs={[
                  { id: 'jobs', label: 'Jobs', href: '/ops' },
                  { id: 'history', label: 'History', href: '/ops?tab=history' },
                ]}
                activeTab={search === '?tab=history' ? 'history' : 'jobs'}
                onChange={(id) => navigate(id === 'history' ? '/ops?tab=history' : '/ops')}
                renderContent={false}
              />
            </>
          ) : (
            <PageHeader title={MENU.entries.find((entry) => entry.path === pathname)?.label ?? 'Page not found'} />
          )}
        </AppShell>
      </div>
    </LinkProvider>
  )
}
