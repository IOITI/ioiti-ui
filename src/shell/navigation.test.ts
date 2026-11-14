import { describe, expect, it } from 'vitest'

import { MENU } from '../test/menu.js'
import { menuEntry, menuSections, PAGE_NOT_FOUND, sidebarSections, trailFor, UNNAMED, type Menu } from './navigation.js'

const entry = (pathname: string) => menuEntry(MENU, pathname)
const trail = (pathname: string, page?: Parameters<typeof trailFor>[2]) => trailFor(MENU, pathname, page)

describe('the menu', () => {
  it('knows the entry a deeper page was reached from', () => {
    expect(entry('/library/assets/blue-logo')?.id).toBe('assets')
    expect(entry('/reports/r1/days/2026-10-09')?.id).toBe('reports')
    expect(entry('/orders/')?.id).toBe('orders')
    // A page whose address only begins like another's is not under it.
    expect(entry('/library/assetsandmore')).toBeUndefined()
    expect(entry('/nothing')).toBeUndefined()
  })

  it('puts a page under the entry closest to it, when two entries share the start of a path', () => {
    expect(entry('/library/assets/archive')?.id).toBe('archive')
    expect(entry('/library/assets/archive/7')?.id).toBe('archive')
    expect(entry('/library/assets/7')?.id).toBe('assets')
  })

  it('is what the sidebar lists: sections in their order, each entry a link to its page', () => {
    const sections = sidebarSections(MENU)
    expect(sections.map((section) => section.title)).toEqual(['Work', 'Reports', 'Library', 'Settings'])
    expect(sections[0].items).toEqual([
      { id: 'dashboard', label: 'Dashboard', icon: undefined, badge: undefined, href: '/' },
      { id: 'orders', label: 'Orders', icon: undefined, badge: undefined, href: '/orders' },
      { id: 'customers', label: 'Customers', icon: undefined, badge: undefined, href: '/customers' },
    ])
  })
})

describe('where a page is', () => {
  it('is Home alone on the page at /', () => {
    expect(trail('/')).toEqual([])
  })

  it('is the section of a page of the menu, which is no link, then the page', () => {
    expect(trail('/orders')).toEqual([{ label: 'Work' }, { label: 'Orders' }])
    expect(trail('/orders/')).toEqual([{ label: 'Work' }, { label: 'Orders' }])
    expect(trail('/library/assets')).toEqual([{ label: 'Library' }, { label: 'Assets' }])
    expect(trail('/settings')).toEqual([{ label: 'Settings' }, { label: 'Settings' }])
  })

  it('leads from a deeper page back to its page of the menu, and ends with the name it gives itself', () => {
    expect(trail('/library/assets/blue-logo', { title: 'Blue logo' })).toEqual([
      { label: 'Library' },
      { label: 'Assets', href: '/library/assets' },
      { label: 'Blue logo' },
    ])
  })

  it('goes through the pages a deeper page names between', () => {
    const day = { title: '9 Oct 2026', parents: [{ label: 'October report', href: '/reports/r1' }] }

    expect(trail('/reports/r1/days/2026-10-09', day)).toEqual([
      { label: 'Reports' },
      { label: 'Reports', href: '/reports' },
      { label: 'October report', href: '/reports/r1' },
      { label: '9 Oct 2026' },
    ])
  })

  it('has an end that says nothing until a deeper page has given its name', () => {
    expect(trail('/reports/r1')).toEqual([{ label: 'Reports' }, { label: 'Reports', href: '/reports' }, { label: UNNAMED }])
  })

  it('says of an address that is no page that it is none', () => {
    expect(trail('/nothing')).toEqual([{ label: PAGE_NOT_FOUND }])
    expect(trail('/orders/nothing', { title: PAGE_NOT_FOUND })).toEqual([
      { label: 'Work' },
      { label: 'Orders', href: '/orders' },
      { label: PAGE_NOT_FOUND },
    ])
  })

  it('reads the name a page of the menu gives itself nowhere: the menu names it', () => {
    expect(trail('/timing', { title: 'Timing of deliveries' })).toEqual([{ label: 'Reports' }, { label: 'Delivery times' }])
  })
})

/** The test menu, its sections said more of: Work without heading, Reports named otherwise, Library folding. */
const SAID: Menu = {
  ...MENU,
  sections: [{ id: 'Work', title: false }, { id: 'Reports', title: 'Figures' }, { id: 'Library', foldable: true }, 'Settings'],
}

describe('sections said more of than their names', () => {
  it('are each said in full, a name alone being a section with its heading', () => {
    expect(menuSections(SAID)).toEqual([
      { id: 'Work', title: false },
      { id: 'Reports', title: 'Figures' },
      { id: 'Library', foldable: true },
      { id: 'Settings' },
    ])
  })

  it('reach the sidebar with their headings, none for a section without, and whether they fold', () => {
    const sections = sidebarSections(SAID)
    expect(sections.map(({ id, title, foldable }) => ({ id, title, foldable }))).toEqual([
      { id: 'Work', title: undefined, foldable: undefined },
      { id: 'Reports', title: 'Figures', foldable: undefined },
      { id: 'Library', title: 'Library', foldable: true },
      { id: 'Settings', title: 'Settings', foldable: undefined },
    ])
    expect(sections[2].items.map((item) => item.id)).toEqual(['files', 'assets', 'archive'])
  })

  it('are said in the trail by their headings, a section without one by nothing', () => {
    expect(trailFor(SAID, '/orders')).toEqual([{ label: 'Orders' }])
    expect(trailFor(SAID, '/timing')).toEqual([{ label: 'Figures' }, { label: 'Delivery times' }])
    expect(trailFor(SAID, '/library/assets/blue-logo', { title: 'Blue logo' })).toEqual([
      { label: 'Library' },
      { label: 'Assets', href: '/library/assets' },
      { label: 'Blue logo' },
    ])
  })

  it('are left out of the trail of a menu that says none', () => {
    const plain: Menu = { ...MENU, trailSections: false }
    expect(trailFor(plain, '/')).toEqual([])
    expect(trailFor(plain, '/orders')).toEqual([{ label: 'Orders' }])
    expect(trailFor(plain, '/reports/r1/days/2026-10-09', { title: '9 Oct 2026', parents: [{ label: 'October report', href: '/reports/r1' }] })).toEqual([
      { label: 'Reports', href: '/reports' },
      { label: 'October report', href: '/reports/r1' },
      { label: '9 Oct 2026' },
    ])
    expect(trailFor(plain, '/nothing')).toEqual([{ label: PAGE_NOT_FOUND }])
  })
})

/** The test menu, Returns under Orders, and Returns' own deeper pages. */
const NESTED: Menu = {
  ...MENU,
  entries: [
    ...MENU.entries,
    { id: 'returns', path: '/orders/returns', label: 'Returns', section: 'Work', parent: 'orders' },
    { id: 'refunds', path: '/orders/refunds', label: 'Refunds', section: 'Work', parent: 'orders', badge: 3 },
    // Not under an entry of its own section: listed as an entry of its own.
    { id: 'stray', path: '/stray', label: 'Stray', section: 'Reports', parent: 'orders' },
  ],
}

describe('entries under another', () => {
  it('are listed under it by the sidebar, which lists only the others at the top', () => {
    const [work, reports] = sidebarSections(NESTED)
    expect(work.items.map((item) => item.id)).toEqual(['dashboard', 'orders', 'customers'])
    expect(work.items[1].children).toEqual([
      { id: 'returns', label: 'Returns', badge: undefined, badgeTone: undefined, href: '/orders/returns' },
      { id: 'refunds', label: 'Refunds', badge: 3, badgeTone: undefined, href: '/orders/refunds' },
    ])
    expect(work.items[0]).not.toHaveProperty('children')
    expect(reports.items.map((item) => item.id)).toEqual(['reports', 'timing', 'stray'])
  })

  it('are reached through their parent, a page: a link in the trail', () => {
    expect(trailFor(NESTED, '/orders')).toEqual([{ label: 'Work' }, { label: 'Orders' }])
    expect(trailFor(NESTED, '/orders/returns')).toEqual([
      { label: 'Work' },
      { label: 'Orders', href: '/orders' },
      { label: 'Returns' },
    ])
    expect(trailFor(NESTED, '/orders/returns/42', { title: 'Return 42' })).toEqual([
      { label: 'Work' },
      { label: 'Orders', href: '/orders' },
      { label: 'Returns', href: '/orders/returns' },
      { label: 'Return 42' },
    ])
    expect(trailFor(NESTED, '/stray')).toEqual([{ label: 'Reports' }, { label: 'Stray' }])
  })
})
