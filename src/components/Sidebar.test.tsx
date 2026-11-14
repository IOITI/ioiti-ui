import { fireEvent, render, screen } from '@testing-library/react'
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

  it('is a link alone in the rail', () => {
    render(<Sidebar sections={NESTED} activeId="returns" defaultCollapsed />)
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/orders')
    expect(screen.queryByRole('button', { name: /The pages under/ })).toBeNull()
  })
})
