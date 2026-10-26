import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentProps, ElementType, ReactNode } from 'react'

import { useAppName } from '../components/app-context.js'
import { MainScrollContext } from '../components/main-scroll-context.js'
import { ThemeToggle } from '../components/ThemeToggle.js'
import { Sidebar, SidebarTrigger, useSidebar } from '../components/ui/sidebar.js'
import { cn } from '../lib/utils.js'
import { menuEntry, sidebarSections } from './navigation.js'
import type { Menu } from './navigation.js'
import { PageTrailProvider, TopBarTrail } from './PageTrail.js'

export interface AppShellProps<S extends string = string> {
  /** The application's menu: the sidebar lists it, the trail of the top bar says where the page is in it. */
  menu: Menu<S>
  /** The address of the page shown (the router's: `useLocation().pathname`; RouterAppShell gives it). */
  pathname: string
  /** The page. */
  children: ReactNode
  /** The name at the top of the sidebar; IoitiProvider's `appName` by default. */
  appName?: string
  /** A line under the name (a version: `v1.2.0`). */
  appDetail?: ReactNode
  /** The square beside the name; the name's first letter by default. */
  brandMark?: ReactNode
  /** In place of the name and its mark, at the top of the sidebar. */
  sidebarHeader?: ReactNode
  /** At the bottom of the sidebar, above its Collapse button: a sign-out (SidebarFooterButton). */
  sidebarFooter?: ReactNode
  /** States the user must not miss, after the trail (StateChip); nothing takes room while there is none. */
  topBarChips?: ReactNode
  /** The right end of the top bar (search, notifications…): the theme button by default, `null` for nothing. */
  topBarEnd?: ReactNode
  /** The pages that take the whole width (an editor beside its preview, a chart); the others stop at 80rem. */
  isWide?: (pathname: string) => boolean
  /** The first step of the trail. */
  home?: { label: string; href: string }
  /** What draws the menu's links; the application's (LinkProvider) by default. */
  linkComponent?: ElementType
  defaultCollapsed?: boolean
}

/**
 * The frame of every page: the sidebar (beside the page from md up, a drawer below; ⌘B folds it),
 * the top bar with the trail of where the page is, and the page itself, which scrolls on its own
 * under the top bar. A page names itself with PageHeader.
 */
export function AppShell<S extends string = string>(props: AppShellProps<S>) {
  return (
    <PageTrailProvider menu={props.menu} pathname={props.pathname}>
      <Shell {...props} />
    </PageTrailProvider>
  )
}

function Shell<S extends string>({
  menu,
  pathname,
  children,
  appName,
  appDetail,
  brandMark,
  sidebarHeader,
  sidebarFooter,
  topBarChips,
  topBarEnd,
  isWide,
  home,
  linkComponent,
  defaultCollapsed,
}: AppShellProps<S>) {
  const providedName = useAppName()
  const name = appName ?? providedName ?? ''
  const wide = isWide?.(pathname) ?? false
  const [mobileOpen, setMobileOpen] = useState(false)
  const main = useRef<HTMLElement>(null)
  // Another page opens at its top: where the one left was scrolled to means nothing there. A change
  // of the query alone leaves the page where it is.
  useEffect(() => {
    if (main.current) main.current.scrollTop = 0
  }, [pathname])

  const current = menuEntry(menu, pathname)
  const sections = useMemo(() => sidebarSections(menu), [menu])

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar
        sections={sections}
        activeId={current?.id ?? ''}
        linkComponent={linkComponent}
        header={sidebarHeader ?? <AppBrand name={name} detail={appDetail} mark={brandMark} />}
        footer={sidebarFooter}
        defaultCollapsed={defaultCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
          <SidebarTrigger onClick={() => setMobileOpen(true)} />
          {/* Where the page is, on every page: it takes the room left, and gives it up first. */}
          <div className="flex min-w-0 flex-1 items-center">
            <TopBarTrail home={home} />
          </div>
          <div className="flex shrink-0 items-center gap-2 empty:hidden">{topBarChips}</div>
          {topBarEnd === undefined ? <ThemeToggle /> : topBarEnd}
        </header>

        {/* Positioned, so that what it scrolls stays in it: text for screen readers placed
            against the page would otherwise make the window itself scroll, onto nothing. */}
        <main ref={main} className="relative flex-1 overflow-y-auto">
          <div className={cn('mx-auto flex w-full flex-col gap-6 p-4 sm:p-6', wide ? 'max-w-none' : 'max-w-7xl')}>
            <MainScrollContext.Provider value={main}>{children}</MainScrollContext.Provider>
          </div>
        </main>
      </div>
    </div>
  )
}

/** The application's name at the top of the sidebar, beside its mark; the mark alone once the sidebar is folded. */
export function AppBrand({ name, detail, mark }: { name: string; detail?: ReactNode; mark?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">
        {mark ?? name.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold">{name}</p>
        {detail && <p className="truncate text-[11px] text-muted-foreground">{detail}</p>}
      </div>
    </div>
  )
}

interface SidebarFooterButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  /** An icon of lucide-react, as an element: `<LogOut />`. */
  icon: ReactNode
  label: string
}

/** An action at the bottom of the sidebar (signing out), its icon alone once the sidebar is folded. */
export function SidebarFooterButton({ icon, label, className, ...props }: SidebarFooterButtonProps) {
  const { collapsed } = useSidebar()
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-neutral-600 outline-none transition-colors hover:bg-neutral-200/70 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white dark:focus-visible:ring-neutral-600/60',
        className,
      )}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center [&>svg]:size-[18px]">{icon}</span>
      {!collapsed && <span className="flex-1 whitespace-nowrap text-left">{label}</span>}
    </button>
  )
}
