import { PageHeader } from 'ioiti-ui'
import type { Menu } from 'ioiti-ui'
import { RouterAppShell } from 'ioiti-ui/react-router'
import { AppWindow, LayoutGrid } from 'lucide-react'
import { useLocation } from 'react-router'

/** Pages of this gallery: an entry leads there, through the router. */
const MENU: Menu = {
  sections: [{ id: 'Gallery', title: false }, 'Shell'],
  // The section and its first entry share a name: the trail says it once.
  trailSections: false,
  entries: [
    { id: 'all', path: '/components', label: 'All components', section: 'Gallery', icon: <LayoutGrid /> },
    { id: 'shell', path: '/components/shell', label: 'Shell', section: 'Shell', icon: <AppWindow /> },
    { id: 'router-root', path: '/components/shell/router-root', label: 'RouterRoot', section: 'Shell', parent: 'shell' },
    { id: 'app-shell', path: '/components/shell/app-shell', label: 'AppShell', section: 'Shell', parent: 'shell' },
    { id: 'sidebar', path: '/components/shell/sidebar', label: 'Sidebar', section: 'Shell', parent: 'shell' },
  ],
}

function Page() {
  const { pathname } = useLocation()
  return <PageHeader title="The router’s address" description={`This frame shows ${pathname}: the entry its sidebar marks, the trail of its top bar.`} />
}

export default function RouterRootShellInABox() {
  return (
    <div className="h-[24rem] overflow-hidden rounded-xl border border-border">
      {/* The layout route of an application's pages; given children, it draws them in place of the outlet. */}
      <RouterAppShell
        menu={MENU}
        appName="My App"
        appDetail="v1.2.0"
        home={{ label: 'Gallery', href: '/' }}
        topBarEnd={null}
        shortcutsDialog={false}
        className="h-full"
      >
        <Page />
      </RouterAppShell>
    </div>
  )
}
