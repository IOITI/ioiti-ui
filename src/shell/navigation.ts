import type { ReactNode } from 'react'

import type { SidebarBadgeTone, SidebarSection } from '../components/ui/sidebar.js'

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
  /** A count ("38") or a state in a word ("Degraded", "2 open"), after its label. */
  badge?: string | number
  /** The badge's tone, for a state: `warning` or `negative`, in its colour with a dot; a count stays neutral. */
  badgeTone?: SidebarBadgeTone
  /**
   * The entry this one is under (its `id`), in the same section: the sidebar lists it under its parent, which
   * opens on its pages and is a page itself, and the trail goes through the parent ("Home › Work › Orders ›
   * Returns"). One level: a parent has no parent.
   */
  parent?: string
}

/**
 * A section of the menu, said more of than its name: drawn without a heading (`title: false`, a menu's first
 * section often), or folded by the reader (`foldable`: folded until it is unfolded, or until the page shown is in
 * it; each reader's choice is kept by the browser).
 */
export interface MenuSection<S extends string = string> {
  id: S
  /** Its heading in the sidebar and its step in the trail: its id by default; `false`, none. */
  title?: string | false
  foldable?: boolean
}

/** The sections, in the order the sidebar shows them, and the pages under them. */
export interface Menu<S extends string = string> {
  /** Each a name (its heading), or said more of (`MenuSection`). */
  sections: readonly (S | MenuSection<S>)[]
  entries: readonly MenuEntry<S>[]
  /**
   * Whether the trail says the section of a page ("Home › Work › Orders"): yes by default. A menu whose sections
   * only group its entries in the sidebar says no ("Home › Orders").
   */
  trailSections?: boolean
}

/** The sections of a menu, each said in full. */
export function menuSections<S extends string>(menu: Menu<S>): MenuSection<S>[] {
  return menu.sections.map((section) => (typeof section === 'string' ? { id: section } : section))
}

/** The heading of a section, or nothing for a section drawn without one. */
function headingOf(section: MenuSection | undefined, id: string): string | undefined {
  if (section?.title === false) return undefined
  return section?.title ?? id
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
 * its name. The page at `/` is Home itself: nothing comes after it. No section
 * step for a section without a heading, nor in a menu whose trail says none
 * (`trailSections: false`).
 */
export function trailFor(menu: Menu, pathname: string, page?: PageName | null): Crumb[] {
  const entry = menuEntry(menu, pathname)
  if (!entry) return [{ label: page?.title ?? PAGE_NOT_FOUND }]
  if (entry.path === '/') return []
  const heading =
    menu.trailSections === false
      ? undefined
      : headingOf(menuSections(menu).find((section) => section.id === entry.section), entry.section)
  const section: Crumb[] = heading ? [{ label: heading }] : []
  // An entry under another goes through it: a page, so a link.
  const parent = parentOf(menu, entry)
  if (parent) section.push({ label: parent.label, href: parent.path })
  if (withoutTrailingSlash(pathname) === entry.path) return [...section, { label: entry.label }]
  return [
    ...section,
    { label: entry.label, href: entry.path },
    ...(page?.parents ?? []),
    { label: page?.title ?? UNNAMED },
  ]
}

/** The entry another is under, when it names one of the same section (a parent has no parent of its own). */
function parentOf<S extends string>(menu: Menu<S>, entry: MenuEntry<S>): MenuEntry<S> | undefined {
  if (entry.parent === undefined) return undefined
  const parent = menu.entries.find((candidate) => candidate.id === entry.parent)
  return parent && parent.section === entry.section && parent.parent === undefined ? parent : undefined
}

/**
 * The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed;
 * the entries under another (`parent`) listed under it.
 */
export function sidebarSections(menu: Menu): SidebarSection[] {
  return menuSections(menu).map((section) => {
    const entries = menu.entries.filter((entry) => entry.section === section.id)
    return {
      id: section.id,
      title: headingOf(section, section.id),
      ...(section.foldable ? { foldable: true } : {}),
      items: entries
        .filter((entry) => !parentOf(menu, entry))
        .map(({ id, label, icon, badge, badgeTone, path }) => {
          const children = entries
            .filter((child) => parentOf(menu, child)?.id === id)
            .map((child) => ({ id: child.id, label: child.label, badge: child.badge, badgeTone: child.badgeTone, href: child.path }))
          return { id, label, icon, badge, badgeTone, href: path, ...(children.length ? { children } : {}) }
        }),
    }
  })
}
