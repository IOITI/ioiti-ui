import type { ReactNode } from 'react'

import type { SidebarSection } from '../components/ui/sidebar.js'

/**
 * The menu of an application, and where each page stands in it: the sidebar
 * lists it, and the trail of the top bar says it, from this one table.
 */

/** A page of the menu, under its section. */
export interface MenuEntry<S extends string = string> {
  id: string
  path: string
  label: string
  section: S
  /** An icon of lucide-react, as an element: `<LayoutDashboard />`. */
  icon?: ReactNode
  badge?: string | number
}

/** The sections, in the order the sidebar shows them, and the pages under them. */
export interface Menu<S extends string = string> {
  sections: readonly S[]
  entries: readonly MenuEntry<S>[]
}

/** A step of a trail: a link unless it is the page shown, or a section, which has no page. */
export interface Crumb {
  label: string
  href?: string
}

/**
 * What a page deeper than the menu says of itself (its PageHeader does): its
 * name, and the pages between its entry of the menu and itself.
 */
export interface PageName {
  title: string
  parents?: Crumb[]
}

/** The first step of every trail. */
export const DEFAULT_HOME = { label: 'Home', href: '/' }

export const PAGE_NOT_FOUND = 'Page not found'
/** The end of a deeper page's trail until the page has said its name. */
export const UNNAMED = '…'

function withoutTrailingSlash(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/'
}

function isUnder(path: string, entryPath: string): boolean {
  return entryPath === '/' ? path === '/' : path === entryPath || path.startsWith(`${entryPath}/`)
}

/**
 * The entry of the menu a page is under: its own, or the one of the page it was reached from
 * (`/orders/42` is under Orders). The longest path wins, for a menu that has `/items` and
 * `/items/archive`.
 */
export function menuEntry<S extends string>(menu: Menu<S>, pathname: string): MenuEntry<S> | undefined {
  const path = withoutTrailingSlash(pathname)
  let found: MenuEntry<S> | undefined
  for (const entry of menu.entries) {
    if (isUnder(path, entry.path) && (!found || entry.path.length > found.path.length)) found = entry
  }
  return found
}

/**
 * Where a page is, after Home: the section of its entry of the menu (not a
 * link: a section has no page of its own), then the entry; for a page deeper
 * than the menu, the entry becomes a link and the page adds its parents and
 * its name. The page at `/` is Home itself: nothing comes after it.
 */
export function trailFor(menu: Menu, pathname: string, page?: PageName | null): Crumb[] {
  const entry = menuEntry(menu, pathname)
  if (!entry) return [{ label: page?.title ?? PAGE_NOT_FOUND }]
  if (entry.path === '/') return []
  if (withoutTrailingSlash(pathname) === entry.path) return [{ label: entry.section }, { label: entry.label }]
  return [
    { label: entry.section },
    { label: entry.label, href: entry.path },
    ...(page?.parents ?? []),
    { label: page?.title ?? UNNAMED },
  ]
}

/** The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed. */
export function sidebarSections(menu: Menu): SidebarSection[] {
  return menu.sections.map((title) => ({
    title,
    items: menu.entries
      .filter((entry) => entry.section === title)
      .map(({ id, label, icon, badge, path }) => ({ id, label, icon, badge, href: path })),
  }))
}
