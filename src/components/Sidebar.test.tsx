import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { sidebarSections } from '../shell/navigation.js'
import { Sidebar } from './ui/sidebar.js'

const SECTIONS = sidebarSections({
  sections: ['Work'],
  entries: [
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work', badge: 38 },
    { id: 'api', path: '/api', label: 'API', section: 'Work', badge: 'Degraded', badgeTone: 'warning' },
    { id: 'incidents', path: '/incidents', label: 'Incidents', section: 'Work', badge: '2 open', badgeTone: 'negative' },
  ],
})

describe('the sidebar\'s entries', () => {
  it('end with a count, quiet, or a state in its tone with a dot', () => {
    render(<Sidebar sections={SECTIONS} activeId="orders" />)
    expect(screen.getByText('38')).toHaveClass('rounded-md', 'tabular-nums')
    expect(screen.getByText('Degraded')).toHaveClass('text-warning')
    expect(screen.getByText('2 open')).toHaveClass('text-negative')
    expect(screen.getByText('2 open').querySelector('[aria-hidden]')).toHaveClass('rounded-full', 'bg-current')
  })

  it('name themselves in a tip outside the sidebar when it is folded: a blur or a filter on it would hold and cut the tip', () => {
    const { container } = render(<Sidebar sections={SECTIONS} activeId="orders" defaultCollapsed />)
    fireEvent.mouseEnter(screen.getByRole('link', { name: /API/ }))
    const tip = screen.getAllByText('API').find((element) => !container.contains(element))!
    expect(tip).toBeDefined()
    expect(tip.closest('.fixed')!.parentElement).toBe(document.body)
  })
})

const NESTED = sidebarSections({
  sections: ['Work'],
  entries: [
    { id: 'orders', path: '/orders', label: 'Orders', section: 'Work' },
    { id: 'returns', path: '/orders/returns', label: 'Returns', section: 'Work', parent: 'orders' },
    { id: 'customers', path: '/customers', label: 'Customers', section: 'Work' },
    { id: 'vip', path: '/customers/vip', label: 'VIP', section: 'Work', parent: 'customers' },
  ],
})

describe('an entry with entries under it', () => {
  it('is a link to its page, and a chevron apart opens it on them', async () => {
    render(<Sidebar sections={NESTED} activeId="orders" />)
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/orders')
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Orders' })).not.toHaveAttribute('aria-expanded')
    // Open on the page shown, which it is.
    const orders = screen.getByRole('button', { name: 'The pages under Orders' })
    expect(orders).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(orders.getAttribute('aria-controls')!)).toContainElement(screen.getByRole('link', { name: 'Returns' }))
    const customers = screen.getByRole('button', { name: 'The pages under Customers' })
    expect(customers).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'VIP' })).toBeNull()

    fireEvent.click(customers)
    expect(customers).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'VIP' })).toHaveAttribute('href', '/customers/vip')
  })

  it('opens on the page shown at every page, keeping those the reader opened', async () => {
    const { rerender } = render(<Sidebar sections={NESTED} activeId="returns" />)
    expect(screen.getByRole('button', { name: 'The pages under Orders' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Returns' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Orders' })).not.toHaveAttribute('aria-current')

    rerender(<Sidebar sections={NESTED} activeId="vip" />)
    expect(screen.getByRole('button', { name: 'The pages under Customers' })).toHaveAttribute('aria-expanded', 'true')
    // Opened by the page, closed by the next.
    expect(screen.getByRole('button', { name: 'The pages under Orders' })).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'The pages under Orders' }))
    rerender(<Sidebar sections={NESTED} activeId="customers" />)
    expect(screen.getByRole('button', { name: 'The pages under Orders' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('closed, says that a page under it has a badge to read, in the gravest tone among them', () => {
    const sections = sidebarSections({
      sections: ['Work'],
      entries: [
        { id: 'orders', path: '/orders', label: 'Orders', section: 'Work' },
        { id: 'returns', path: '/orders/returns', label: 'Returns', section: 'Work', parent: 'orders', badge: 3 },
        { id: 'late', path: '/orders/late', label: 'Late', section: 'Work', parent: 'orders', badge: '2 late', badgeTone: 'warning' },
        { id: 'customers', path: '/customers', label: 'Customers', section: 'Work' },
      ],
    })
    render(<Sidebar sections={sections} activeId="customers" />)
    const orders = screen.getByRole('link', { name: 'Orders, with counts' })
    expect(orders.querySelector('.rounded-full[aria-hidden]')).toHaveClass('bg-current', 'text-warning')
    // Open, its pages say their own.
    fireEvent.click(screen.getByRole('button', { name: 'The pages under Orders' }))
    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getByText('2 late')).toHaveClass('text-warning')
  })
})

/** Rules, whose first page (Library) is at its address, and Settings, a page of its own above its pages. */
const SHARED = sidebarSections({
  sections: ['Main'],
  entries: [
    { id: 'home', path: '/', label: 'Home', section: 'Main' },
    { id: 'rules', path: '/rules', label: 'Rules', section: 'Main' },
    { id: 'library', path: '/rules', label: 'Library', section: 'Main', parent: 'rules' },
    { id: 'updates', path: '/updates', label: 'Updates', section: 'Main', parent: 'rules', badge: 4 },
    { id: 'settings', path: '/settings', label: 'Settings', section: 'Main' },
    { id: 'users', path: '/settings/users', label: 'Users', section: 'Main', parent: 'settings' },
  ],
})

describe('an entry with entries under it, in the rail', () => {
  it('shows its pages beside it, the one shown marked, and has the pill while it holds it', async () => {
    const user = userEvent.setup()
    render(<Sidebar sections={SHARED} activeId="updates" defaultCollapsed />)
    const rules = screen.getByRole('button', { name: 'Rules' })
    expect(rules).toHaveAttribute('aria-haspopup', 'menu')
    expect(rules).toHaveAttribute('aria-expanded', 'false')
    expect(rules.querySelector('[class*="bg-surface-hover"]')).not.toBeNull()
    expect(screen.queryByRole('button', { name: /The pages under/ })).toBeNull()

    await user.click(rules)
    const menu = await screen.findByRole('menu', { name: 'Rules' })
    // Its first page is at its own address: listed once, as Library.
    const links = within(menu).getAllByRole('menuitem')
    expect(links.map((link) => link.textContent)).toEqual(['Library', 'Updates4'])
    expect(within(menu).getByRole('menuitem', { name: 'Library' })).toHaveAttribute('href', '/rules')
    expect(within(menu).getByRole('menuitem', { name: /Updates/ })).toHaveAttribute('aria-current', 'page')
    expect(rules).toHaveAttribute('aria-expanded', 'true')
  })

  it('lists its own page first when it has one, and goes back to its button with Escape', async () => {
    const user = userEvent.setup()
    render(<Sidebar sections={SHARED} activeId="settings" defaultCollapsed />)
    const settings = screen.getByRole('button', { name: 'Settings' })
    settings.focus()
    await user.keyboard('{Enter}')
    const menu = await screen.findByRole('menu', { name: 'Settings' })
    expect(within(menu).getAllByRole('menuitem').map((link) => link.getAttribute('href'))).toEqual(['/settings', '/settings/users'])
    expect(within(menu).getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('aria-current', 'page')
    expect(within(menu).getByRole('menuitem', { name: 'Settings' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(within(menu).getByRole('menuitem', { name: 'Users' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    expect(settings).toHaveFocus()
  })

  it('opened, gives no tip: its pages are beside it', async () => {
    const user = userEvent.setup()
    const { container } = render(<Sidebar sections={SHARED} activeId="home" defaultCollapsed />)
    const rules = screen.getByRole('button', { name: 'Rules' })
    fireEvent.mouseEnter(rules)
    expect(screen.getAllByText('Rules').some((element) => !container.contains(element))).toBe(true)
    await user.click(rules)
    await screen.findByRole('menu', { name: 'Rules' })
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.queryByText('Settings', { selector: '.fixed *' })).toBeNull()
  })
})

describe('a section at the foot of the sidebar', () => {
  const FOOT = sidebarSections({
    sections: ['Main', { id: 'Foot', title: 'Help', place: 'footer' }],
    entries: [
      { id: 'home', path: '/', label: 'Home', section: 'Main' },
      { id: 'docs', path: '/docs', label: 'Documentation', section: 'Foot' },
    ],
  })

  it('is drawn above Collapse, out of the list of pages, without a heading', () => {
    render(<Sidebar sections={FOOT} activeId="docs" />)
    const docs = screen.getByRole('link', { name: 'Documentation' })
    expect(screen.getByRole('navigation', { name: 'Main' })).not.toContainElement(docs)
    expect(docs).toHaveAttribute('aria-current', 'page')
    expect(docs.compareDocumentPosition(screen.getByRole('button', { name: 'Collapse sidebar' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByText('Help')).toBeNull()
  })

  it('names its entries in a tip in the rail', () => {
    const { container } = render(<Sidebar sections={FOOT} activeId="home" defaultCollapsed />)
    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Documentation' }))
    expect(screen.getAllByText('Documentation').some((element) => !container.contains(element))).toBe(true)
  })
})
