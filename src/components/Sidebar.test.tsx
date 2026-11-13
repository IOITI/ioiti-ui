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

  it('name themselves in a tip outside the sidebar when it is folded: its blur would hold and cut the tip', () => {
    const { container } = render(<Sidebar sections={SECTIONS} activeId="orders" defaultCollapsed />)
    fireEvent.mouseEnter(screen.getByRole('link', { name: /API/ }))
    const tip = screen.getAllByText('API').find((element) => !container.contains(element))!
    expect(tip).toBeDefined()
    expect(tip.closest('.fixed')!.parentElement).toBe(document.body)
  })
})
