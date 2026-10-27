import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Receipt } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { SpotlightSearch } from './ui/spotlight-search.js'
import type { SpotlightSearchItem } from './ui/spotlight-search.js'

const ITEMS: SpotlightSearchItem[] = [
  { id: 'orders', title: 'Orders', category: 'Pages', href: '/orders', icon: <Receipt />, shortcut: ['G', 'O'] },
  { id: 'it-1042', title: 'IT-1042', category: 'Orders', description: 'Atelier Brun', href: '/orders/IT-1042' },
  { id: 'customers', title: 'Customers', category: 'Pages', href: '/customers' },
]

describe('SpotlightSearch', () => {
  it('draws an entry\'s icon and its keys', () => {
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" />)
    const orders = screen.getByRole('option', { name: /^Orders/ })
    expect(orders.querySelector('svg.lucide-receipt')).not.toBeNull()
    expect(Array.from(orders.querySelectorAll('kbd')).map((key) => key.textContent)).toEqual(['G', 'O'])
  })

  it('offers the searches made before while nothing is typed, and types one again', async () => {
    const user = userEvent.setup()
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} recentSearches={['brun', 'refund']} label="Go to" />)
    const list = screen.getByRole('listbox', { name: 'Go to' })
    expect(list).toHaveTextContent('Recent searches')
    expect(within(list).getAllByRole('option')[0]).toHaveTextContent('brun')

    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('brun')
    expect(within(list).getAllByRole('option').map((option) => option.textContent)).toEqual(['IT-1042Atelier BrunOrders'])
  })

  it('lists its entries under their categories when grouped, the arrows going down them in that order', async () => {
    const user = userEvent.setup()
    const chosen = vi.fn()
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} grouped onSelect={chosen} onNavigate={() => {}} label="Go to" />)
    const list = screen.getByRole('listbox', { name: 'Go to' })
    expect(within(list).getAllByRole('option').map((option) => option.textContent?.replace(/GO$/, ''))).toEqual([
      'Orders',
      'Customers',
      'IT-1042Atelier Brun',
    ])
    expect(list).toHaveTextContent(/^Pages.*Orders.*Orders/)

    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{ArrowDown}{Enter}')
    expect(chosen).toHaveBeenCalledWith(expect.objectContaining({ id: 'customers' }))
  })
})
