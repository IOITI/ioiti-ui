import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Receipt } from 'lucide-react'
import { useRef, useState, useSyncExternalStore } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { IoitiProvider } from './IoitiProvider.js'
import { useShortcutRegistry } from './shortcuts-context.js'
import { SettleModal } from './ui/settle-modal.js'
import { SpotlightSearch } from './ui/spotlight-search.js'
import type { SpotlightSearchItem } from './ui/spotlight-search.js'

const ITEMS: SpotlightSearchItem[] = [
  { id: 'orders', title: 'Orders', category: 'Pages', href: '/orders', icon: <Receipt />, shortcut: ['G', 'O'] },
  { id: 'it-1042', title: 'IT-1042', category: 'Orders', description: 'Atelier Brun', href: '/orders/IT-1042' },
  { id: 'customers', title: 'Customers', category: 'Pages', href: '/customers' },
]

describe('SpotlightSearch', () => {
  it('is drawn in document.body, out of what it is used in: a top bar that blurs would hold and cut it', () => {
    const { container } = render(
      <header>
        <SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" />
      </header>,
    )
    const dialog = screen.getByRole('dialog')
    expect(container.contains(dialog)).toBe(false)
    expect(dialog.closest('.fixed.inset-0')?.parentElement).toBe(document.body)
  })

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

  it('keeps the focus in its field: Tab goes round its own controls, and a search made before is typed there', async () => {
    const user = userEvent.setup()
    render(
      <SpotlightSearch
        open
        onOpenChange={() => {}}
        items={ITEMS}
        recentSearches={['brun']}
        label="Go to"
        footer={<button type="button">Done</button>}
      />,
    )
    const field = screen.getByRole('combobox', { name: 'Search' })
    await waitFor(() => expect(field).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()
    await user.tab()
    expect(field).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()

    await user.click(field)
    await user.click(screen.getByRole('option', { name: 'brun' }))
    expect(field).toHaveValue('brun')
    expect(field).toHaveFocus()
  })

  it('gives the focus back to what opened it, unless what an entry did took it elsewhere', async () => {
    const user = userEvent.setup()
    function Page() {
      const [open, setOpen] = useState(false)
      const note = useRef<HTMLInputElement>(null)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <input aria-label="Note" ref={note} />
          <SpotlightSearch
            open={open}
            onOpenChange={setOpen}
            label="Do"
            items={[
              { id: 'orders', title: 'Orders', category: 'Pages' },
              { id: 'note', title: 'Write a note', category: 'Actions', action: () => note.current?.focus() },
            ]}
          />
        </>
      )
    }
    render(<Page />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('note{Enter}')
    expect(screen.getByRole('textbox', { name: 'Note' })).toHaveFocus()
  })

  it('opens with ⌘K (Ctrl K here) when asked, held by its caller or not, closes with it, and is listed', async () => {
    const user = userEvent.setup()
    function Listed() {
      const registry = useShortcutRegistry()
      const shortcuts = useSyncExternalStore(registry.subscribe, registry.list)
      return <p data-testid="listed">{shortcuts.map((shortcut) => `${shortcut.keys} ${shortcut.description} ${shortcut.group}`).join(', ')}</p>
    }
    function Held() {
      const [open, setOpen] = useState(false)
      return <SpotlightSearch open={open} onOpenChange={setOpen} enableGlobalShortcut items={ITEMS} label="Go to a page" />
    }
    for (const palette of [<Held key="held" />, <SpotlightSearch key="own" enableGlobalShortcut items={ITEMS} label="Go to a page" />]) {
      const { unmount } = render(
        <IoitiProvider>
          {palette}
          <Listed />
        </IoitiProvider>,
      )
      expect(screen.queryByRole('dialog')).toBeNull()
      await user.keyboard('{Control>}k{/Control}')
      const field = await screen.findByRole('combobox', { name: 'Search' })
      await waitFor(() => expect(field).toHaveFocus())
      await user.keyboard('{Control>}k{/Control}')
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      unmount()
    }

    render(
      <IoitiProvider>
        <SpotlightSearch enableGlobalShortcut items={ITEMS} label="Go to a page" />
        <Listed />
      </IoitiProvider>,
    )
    expect(screen.getByTestId('listed')).toHaveTextContent('mod+k Go to a page Navigation')
  })

  it('is not opened by ⌘K unless asked', async () => {
    const user = userEvent.setup()
    render(<SpotlightSearch items={ITEMS} label="Go to" />)
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('is closed once by Escape, its shortcut asked for too', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onClose = vi.fn()
    render(<SpotlightSearch open onOpenChange={onOpenChange} onClose={onClose} enableGlobalShortcut items={ITEMS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps its keys from a dialog under it: its Escape closes it alone, its Tab stays in it', async () => {
    const user = userEvent.setup()
    function Both() {
      const [modal, setModal] = useState(true)
      const [palette, setPalette] = useState(false)
      return (
        <>
          <SettleModal open={modal} onClose={() => setModal(false)} title="Edit">
            <button type="button" onClick={() => setPalette(true)}>
              Attach
            </button>
          </SettleModal>
          <SpotlightSearch open={palette} onOpenChange={setPalette} items={ITEMS} label="Attach" />
        </>
      )
    }
    render(<Both />)
    await user.click(screen.getByRole('button', { name: 'Attach' }))
    const field = screen.getByRole('combobox', { name: 'Search' })
    await waitFor(() => expect(field).toHaveFocus())
    await user.tab()
    expect(field).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Attach' })).toBeNull())
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Attach' })).toHaveFocus()
  })

  it('leaves the keys that compose a character to the composition (an IME)', () => {
    const chosen = vi.fn()
    const onOpenChange = vi.fn()
    render(<SpotlightSearch open onOpenChange={onOpenChange} onSelect={chosen} onNavigate={() => {}} items={ITEMS} label="Go to" />)
    const field = screen.getByRole('combobox', { name: 'Search' })
    fireEvent.keyDown(field, { key: 'Enter', isComposing: true })
    fireEvent.keyDown(field, { key: 'Enter', keyCode: 229 })
    fireEvent.keyDown(field, { key: 'Escape', isComposing: true })
    expect(chosen).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(chosen).toHaveBeenCalledWith(expect.objectContaining({ id: 'orders' }))
  })

  it('chooses with the pointer where it moves, not where the list scrolls under it, nor a finger scrolling it', () => {
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" />)
    const [first, second] = screen.getAllByRole('option')
    expect(first).toHaveAttribute('aria-selected', 'true')
    fireEvent.mouseEnter(second)
    fireEvent.pointerMove(second, { pointerType: 'touch' })
    expect(first).toHaveAttribute('aria-selected', 'true')
    fireEvent.pointerMove(second, { pointerType: 'mouse' })
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(first).toHaveAttribute('aria-selected', 'false')
  })

  it('scrolls its own list to the entry the keys choose, never the page', async () => {
    const user = userEvent.setup()
    const ROW = 40
    vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
      return this.getAttribute('role') === 'option' ? Array.from(document.querySelectorAll('[role="option"]')).indexOf(this) * ROW : 0
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.getAttribute('role') === 'option' ? ROW : 0
    })
    vi.spyOn(Element.prototype, 'clientHeight', 'get').mockReturnValue(100)
    const intoView = vi.fn()
    Element.prototype.scrollIntoView = intoView
    try {
      const many = Array.from({ length: 10 }, (_, index): SpotlightSearchItem => ({ id: `e${index}`, title: `Entry ${index}`, category: 'Entries' }))
      render(<SpotlightSearch open onOpenChange={() => {}} items={many} label="Go to" />)
      const scroller = screen.getByRole('listbox').parentElement!
      await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
      expect(screen.getByRole('option', { name: /Entry 3/ })).toHaveAttribute('aria-selected', 'true')
      expect(scroller.scrollTop).toBe(3 * ROW + ROW - 100 + 4)
      await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}')
      expect(screen.getByRole('option', { name: /Entry 9/ })).toHaveAttribute('aria-selected', 'true')
      expect(scroller.scrollTop).toBe(9 * ROW + ROW - 100 + 4)
      await user.keyboard('{ArrowDown}')
      expect(scroller.scrollTop).toBe(0)
      expect(intoView).not.toHaveBeenCalled()
    } finally {
      delete (Element.prototype as Partial<Element>).scrollIntoView
    }
  })

  it('keeps the entry chosen as the entries change, the first one once it is gone', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: /IT-1042/ })).toHaveAttribute('aria-selected', 'true')

    const refund: SpotlightSearchItem = { id: 'refunds', title: 'Refunds', category: 'Pages', href: '/refunds' }
    rerender(<SpotlightSearch open onOpenChange={() => {}} items={[refund, ...ITEMS]} label="Go to" />)
    expect(screen.getByRole('option', { name: /IT-1042/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /IT-1042/ }).id)

    rerender(<SpotlightSearch open onOpenChange={() => {}} items={[refund, ITEMS[0]]} label="Go to" />)
    expect(screen.getByRole('option', { name: /Refunds/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('tells what is typed as it is typed, and that nothing is as it opens, not at each render', async () => {
    const user = userEvent.setup()
    const told = vi.fn()
    const { rerender } = render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" onQueryChange={(query) => told(query)} />)
    expect(told.mock.calls).toEqual([['']])
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('or')
    expect(told.mock.calls).toEqual([[''], ['o'], ['or']])
    rerender(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} label="Go to" onQueryChange={(query) => told(query)} />)
    expect(told).toHaveBeenCalledTimes(3)
  })

  it('holds options alone, under headings that name their groups; what it says of them is outside, and said once typing pauses', async () => {
    const user = userEvent.setup()
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} grouped recentSearches={['brun']} limit={2} label="Go to" />)
    const list = screen.getByRole('listbox', { name: 'Go to' })
    for (const child of Array.from(list.children)) {
      expect(['group', 'option'].includes(child.getAttribute('role') ?? '') || child.getAttribute('aria-hidden') === 'true').toBe(true)
    }
    expect(within(within(list).getByRole('group', { name: 'Recent searches' })).getAllByRole('option')).toHaveLength(1)
    expect(within(within(list).getByRole('group', { name: 'Pages' })).getAllByRole('option')).toHaveLength(1)
    expect(within(within(list).getByRole('group', { name: 'Orders' })).getAllByRole('option')).toHaveLength(1)
    const more = screen.getByText('1 more: type to narrow them down.')
    expect(list).not.toContainElement(more)

    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('or')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('2 results'))
    await user.keyboard('zz')
    const none = screen.getByText(/No results found for/)
    expect(list).not.toContainElement(none)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('No results'))
  })

  it('finds the words typed whatever their case and accents, the best first, and marks them', async () => {
    const user = userEvent.setup()
    const many: SpotlightSearchItem[] = [
      ...Array.from({ length: 60 }, (_, index): SpotlightSearchItem => ({ id: `panel-${index}`, title: `Panel ${index}`, category: 'Panels', description: 'Opens with a button' })),
      { id: 'button', title: 'Button', category: 'Components' },
      { id: 'cv', title: 'Résumé', category: 'Files', description: 'Brasserie Lefèvre' },
    ]
    render(<SpotlightSearch open onOpenChange={() => {}} items={many} grouped label="Go to" />)
    const field = screen.getByRole('combobox', { name: 'Search' })
    await waitFor(() => expect(field).toHaveFocus())
    await user.keyboard('button')
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('Button')
    expect(options).toHaveLength(50)
    expect(screen.getByText('11 more: type to narrow them down.')).toBeInTheDocument()
    expect(within(screen.getByRole('listbox')).getAllByRole('group')[0]).toHaveAccessibleName('Components')

    await user.clear(field)
    await user.keyboard('resume lefevre')
    const cv = screen.getByRole('option', { name: /Résumé/ })
    expect(Array.from(cv.querySelectorAll('mark')).map((mark) => mark.textContent)).toEqual(['Résumé', 'Lefèvre'])
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('lists the entries as given with filter={false} (what a server found), the words typed marked in them', async () => {
    const user = userEvent.setup()
    const found: SpotlightSearchItem[] = [
      { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Acme' },
      { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Brasserie Lefèvre' },
    ]
    render(<SpotlightSearch open onOpenChange={() => {}} filter={false} items={found} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('lefevre')
    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['Order 2026-0041AcmeOrders', 'Order 2026-0042Brasserie LefèvreOrders'])
    expect(options[1].querySelector('mark')).toHaveTextContent('Lefèvre')
  })

  it("draws an entry's keys as this computer writes them, given as a shortcut's", () => {
    render(<SpotlightSearch open onOpenChange={() => {}} items={[{ id: 'orders', title: 'Orders', category: 'Pages', shortcut: 'g o' }]} label="Go to" />)
    expect(screen.getByRole('option', { name: /Orders/ }).querySelector('kbd')).toHaveTextContent(/G.*then.*O/)
  })

  it('says it is searching while entries are found, never that there are none, and keeps those shown', async () => {
    const user = userEvent.setup()
    const found: SpotlightSearchItem[] = [{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme' }]
    const { rerender } = render(<SpotlightSearch open onOpenChange={() => {}} filter={false} loading label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('acme')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.queryByText(/No results/)).toBeNull()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Searching…'))

    rerender(<SpotlightSearch open onOpenChange={() => {}} filter={false} items={found} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1 result'))
    rerender(<SpotlightSearch open onOpenChange={() => {}} filter={false} items={found} loading label="Go to" />)
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Searching…'))
  })

  it('says the search failed, in place of the list or above the last entries found, with a Try again', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const found: SpotlightSearchItem[] = [{ id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme' }]
    const { rerender } = render(<SpotlightSearch open onOpenChange={() => {}} filter={false} error onRetry={onRetry} label="Go to" />)
    const field = screen.getByRole('combobox', { name: 'Search' })
    expect(screen.getByText('The search failed.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
    expect(field).toHaveFocus()

    rerender(<SpotlightSearch open onOpenChange={() => {}} filter={false} items={found} error="The orders could not be searched." onRetry={onRetry} label="Go to" />)
    const banner = screen.getByText('The orders could not be searched.')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('listbox')).not.toContainElement(banner)
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('The orders could not be searched.'))
  })

  it('draws nothing under its field while it has no entries and nothing is typed', () => {
    render(<SpotlightSearch open onOpenChange={() => {}} label="Go to" />)
    expect(screen.queryByText(/No results/)).toBeNull()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})
