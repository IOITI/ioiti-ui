import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Receipt } from 'lucide-react'
import { useState } from 'react'
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

  it('stays open to choose several entries when asked, each chosen one ticked, and chosen again to take it back', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const things: SpotlightSearchItem[] = [
      { id: 'rule-1', title: 'Brute force', category: 'Rules' },
      { id: 'customer-1', title: 'Acme', category: 'Customers' },
    ]
    function Picker() {
      const [picked, setPicked] = useState<string[]>([])
      return (
        <SpotlightSearch
          open
          onOpenChange={onOpenChange}
          items={things}
          label="Attach"
          closeOnSelect={false}
          picked={picked}
          onSelect={(item) =>
            setPicked((was) => (was.includes(item.id) ? was.filter((id) => id !== item.id) : [...was, item.id]))
          }
          footer={`${picked.length} attached`}
        />
      )
    }
    render(<Picker />)
    const list = screen.getByRole('listbox', { name: 'Attach' })
    expect(list).toHaveAttribute('aria-multiselectable', 'true')
    expect(screen.getByText('0 attached')).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: /Brute force/ }))
    await user.click(screen.getByRole('option', { name: /Acme/ }))
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('option', { name: /Brute force/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('option', { name: /Acme/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('2 attached')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus()

    await user.keyboard('{Enter}') // the active entry, the last one pointed at: taken back
    expect(screen.getByRole('option', { name: /Acme/ })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('option', { name: /Brute force/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('1 attached')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes once an entry is chosen, by default, and draws Escape as a key that closes it too', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<SpotlightSearch open onOpenChange={onOpenChange} items={[{ id: 'a', title: 'A thing', category: 'Things' }]} label="Go to" />)
    expect(screen.getByRole('listbox', { name: 'Go to' })).not.toHaveAttribute('aria-multiselectable')
    expect(screen.getByRole('option', { name: /A thing/ })).not.toHaveAttribute('aria-checked')
    await user.click(screen.getByRole('option', { name: /A thing/ }))
    expect(onOpenChange).toHaveBeenCalledWith(false)

    onOpenChange.mockClear()
    const close = screen.getByRole('button', { name: 'Close' })
    expect(close.querySelector('kbd')).toHaveTextContent('Esc')
    await user.click(close)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
