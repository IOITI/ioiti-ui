import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Receipt } from 'lucide-react'
import { useRef, useState, useSyncExternalStore } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { IoitiProvider } from './IoitiProvider.js'
import { LinkProvider } from './LinkProvider.js'
import { useShortcutRegistry } from './shortcuts-context.js'
import { Sheet, SheetBody, SheetContent } from './ui/flysheet.js'
import { Dialog } from './ui/settle-modal.js'
import { SpotlightSearch } from './ui/spotlight-search.js'
import type { SpotlightSearchItem } from './ui/spotlight-search.js'

const LISTS: SpotlightSearchItem[] = [
  {
    id: 'orders',
    title: 'Orders',
    category: 'Lists',
    placeholder: 'An order…',
    items: [
      { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme', href: '/orders/2026-0042' },
      { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Globex', href: '/orders/2026-0041' },
    ],
  },
  { id: 'customers', title: 'Customers', category: 'Lists', href: '/customers', items: [] },
  { id: 'charts', title: 'Charts', category: 'Pages', href: '/charts' },
]

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
          <Dialog open={modal} onClose={() => setModal(false)} title="Edit">
            <button type="button" onClick={() => setPalette(true)}>
              Attach
            </button>
          </Dialog>
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

  it('keeps its keys from a sheet under it as well: Tab round its own controls, its Escape closing it alone, the focus back in the sheet', async () => {
    const user = userEvent.setup()
    const onSheetChange = vi.fn()
    function Both() {
      const [palette, setPalette] = useState(false)
      return (
        <>
          <Sheet defaultOpen onOpenChange={onSheetChange}>
            <SheetContent aria-label="Order 2026-0042">
              <SheetBody>
                <button type="button" onClick={() => setPalette(true)}>
                  Attach
                </button>
              </SheetBody>
            </SheetContent>
          </Sheet>
          <SpotlightSearch open={palette} onOpenChange={setPalette} items={ITEMS} label="Attach" footer={<button type="button">Done</button>} />
        </>
      )
    }
    render(<Both />)
    const attach = await screen.findByRole('button', { name: 'Attach' })
    await user.click(attach)
    const field = screen.getByRole('combobox', { name: 'Search' })
    await waitFor(() => expect(field).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()
    await user.tab()
    expect(field).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Attach' })).toBeNull())
    expect(onSheetChange).not.toHaveBeenCalled()
    expect(attach).toHaveFocus()
    // Then the sheet's own Escape.
    await user.keyboard('{Escape}')
    expect(onSheetChange).toHaveBeenCalledWith(false, { reason: 'escape' })
  })

  it('brings Tab back into its field from outside it, and hears its Escape wherever the focus is', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <>
        <button type="button">On the page</button>
        <SpotlightSearch open onOpenChange={onOpenChange} items={ITEMS} label="Go to" />
      </>,
    )
    const field = screen.getByRole('combobox', { name: 'Search' })
    await waitFor(() => expect(field).toHaveFocus())
    const page = screen.getByRole('button', { name: 'On the page' })
    act(() => page.focus())
    await user.tab()
    expect(field).toHaveFocus()
    // Before the palette in the page's order: Shift+Tab, which would go further back, comes round into it too.
    act(() => page.focus())
    await user.tab({ shift: true })
    expect(field).toHaveFocus()
    act(() => page.focus())
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
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

  it('offers the entries chosen before first while nothing is typed, kept by name (remember)', async () => {
    const user = userEvent.setup()
    function Page() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <SpotlightSearch open={open} onOpenChange={setOpen} remember="go-to" items={ITEMS} onNavigate={() => {}} label="Go to" />
        </>
      )
    }
    render(<Page />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    expect(screen.queryByRole('group', { name: 'Recent' })).toBeNull()
    await user.keyboard('custo{Enter}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await user.click(screen.getByRole('button', { name: 'Open' }))
    const recent = await screen.findByRole('group', { name: 'Recent' })
    expect(within(recent).getAllByRole('option').map((option) => option.textContent)).toEqual(['CustomersPages'])
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('c')
    expect(screen.queryByRole('group', { name: 'Recent' })).toBeNull()
  })

  it("draws one chosen before that leads somewhere, gone from the entries, with the application's link; one that acts only while it is there", () => {
    function AppLink(props: ComponentProps<'a'>) {
      return <a data-link="app" {...props} />
    }
    window.localStorage.setItem(
      'ioiti.theme.spotlight.go-to',
      JSON.stringify([
        { id: 'o42', title: 'Order 2026-0042', category: 'Orders', href: '/orders/2026-0042' },
        { id: 'export', title: 'Export the orders', category: 'Actions' },
      ]),
    )
    render(
      <LinkProvider component={AppLink}>
        <SpotlightSearch open onOpenChange={() => {}} remember="go-to" items={ITEMS} label="Go to" />
      </LinkProvider>,
    )
    const options = within(screen.getByRole('group', { name: 'Recent' })).getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveAttribute('data-link', 'app')
    expect(options[0]).toHaveAttribute('href', '/orders/2026-0042')
    expect(options[0]).toHaveAttribute('aria-keyshortcuts', 'Shift+Delete')
  })

  it('forgets one chosen before with Shift+Delete, the next one chosen', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      'ioiti.theme.spotlight.go-to',
      JSON.stringify([
        { id: 'o42', title: 'Order 2026-0042', category: 'Orders', href: '/orders/2026-0042' },
        { id: 'customers', title: 'Customers', category: 'Pages', href: '/customers' },
      ]),
    )
    render(<SpotlightSearch open onOpenChange={() => {}} remember="go-to" items={ITEMS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Shift>}{Delete}{/Shift}')
    const left = within(screen.getByRole('group', { name: 'Recent' })).getAllByRole('option')
    expect(left.map((option) => option.textContent)).toEqual(['CustomersPages'])
    expect(left[0]).toHaveAttribute('aria-selected', 'true')
    expect(JSON.parse(window.localStorage.getItem('ioiti.theme.spotlight.go-to')!).map((entry: { id: string }) => entry.id)).toEqual(['customers'])
  })

  it('keeps nothing without remember', async () => {
    const user = userEvent.setup()
    render(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} onNavigate={() => {}} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(window.localStorage.length).toBe(0)
  })

  it('opens an entry that leads somewhere in another tab with ⌘↵ (Ctrl ↵ here), remembered, the palette left open', async () => {
    const user = userEvent.setup()
    const opened = vi.spyOn(window, 'open').mockImplementation(() => null)
    const chosen = vi.fn()
    const onOpenChange = vi.fn()
    render(<SpotlightSearch open onOpenChange={onOpenChange} onSelect={chosen} remember="go-to" items={ITEMS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('{Control>}{Enter}{/Control}')
    expect(opened).toHaveBeenCalledWith(expect.stringMatching(/^http.*\/orders$/), '_blank', 'noopener')
    expect(chosen).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(within(screen.getByRole('group', { name: 'Recent' })).getByRole('option')).toHaveTextContent('Orders')
  })

  it('opens the list of an entry, its title before the field, searched alone, telling where', async () => {
    const user = userEvent.setup()
    const told = vi.fn()
    const chosen = vi.fn()
    render(
      <SpotlightSearch
        open
        onOpenChange={() => {}}
        items={LISTS}
        onQueryChange={(query, scope) => told(query, scope?.id)}
        onSelect={chosen}
        onNavigate={() => {}}
        label="Go to"
      />,
    )
    const orders = screen.getByRole('option', { name: /Orders/ })
    expect(orders).toHaveAccessibleDescription('Opens its list')
    expect(orders.querySelector('svg.lucide-chevron-right')).not.toBeNull()
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('ord{Enter}')
    expect(chosen).not.toHaveBeenCalled()
    expect(told).toHaveBeenLastCalledWith('', 'orders')
    const field = screen.getByRole('combobox', { name: 'Search Orders' })
    expect(field).toHaveValue('')
    expect(field).toHaveAttribute('placeholder', 'An order…')
    expect(screen.getByRole('button', { name: 'Back from Orders' })).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Order 2026-0042AcmeOrders', 'Order 2026-0041GlobexOrders'])
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Orders: 2 results'))

    await user.keyboard('globex')
    expect(told).toHaveBeenLastCalledWith('globex', 'orders')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await user.keyboard('{Enter}')
    expect(chosen).toHaveBeenCalledWith(expect.objectContaining({ id: 'o41' }))
  })

  it('goes back from a list with Backspace in its empty field, once as it is held, what was typed above typed again', async () => {
    const user = userEvent.setup()
    render(<SpotlightSearch open onOpenChange={() => {}} items={LISTS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('ord{Enter}')
    const field = screen.getByRole('combobox', { name: 'Search Orders' })
    fireEvent.keyDown(field, { key: 'Backspace', repeat: true })
    expect(screen.getByRole('combobox', { name: 'Search Orders' })).toBeInTheDocument()
    await user.keyboard('{Backspace}')
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('ord')
    expect(screen.getByRole('option', { name: /Orders/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('goes back from a list with Escape, then closes; its title, pressed, goes back too, the focus in the field', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<SpotlightSearch open onOpenChange={onOpenChange} items={LISTS} label="Go to" />)
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('ord{Enter}{Escape}')
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus()
    expect(onOpenChange).not.toHaveBeenCalled()
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('button', { name: 'Back from Orders' }))
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows the entries of a list as they are found, and opens the list of an entry that leads somewhere too', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    const { rerender } = render(<SpotlightSearch open onOpenChange={() => {}} items={LISTS} onNavigate={navigate} label="Go to" />)
    expect(screen.getByRole('option', { name: /Customers/ }).tagName).not.toBe('A')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('cust{Enter}')
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    const filled = LISTS.map((entry) => (entry.id === 'customers' ? { ...entry, items: [{ id: 'acme', title: 'Acme', category: 'Customers', href: '/customers/acme' }] } : entry))
    rerender(<SpotlightSearch open onOpenChange={() => {}} items={filled} onNavigate={navigate} label="Go to" />)
    expect(screen.getByRole('option', { name: /Acme/ })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Customers: 1 result'))
  })

  it('chooses several in a list, each ticked, Escape going back before it closes', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    // Things to attach, which lead nowhere: an entry that leads somewhere closes the palette.
    const things: SpotlightSearchItem[] = [
      {
        id: 'orders',
        title: 'Orders',
        category: 'Lists',
        items: [
          { id: 'o42', title: 'Order 2026-0042', category: 'Orders' },
          { id: 'o41', title: 'Order 2026-0041', category: 'Orders' },
        ],
      },
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
          onSelect={(item) => setPicked((was) => (was.includes(item.id) ? was.filter((id) => id !== item.id) : [...was, item.id]))}
        />
      )
    }
    render(<Picker />)
    expect(screen.getByRole('option', { name: /Orders/ })).not.toHaveAttribute('aria-checked')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus())
    await user.keyboard('ord{Enter}{Enter}{ArrowDown}{Enter}')
    expect(screen.getByRole('option', { name: /2026-0042/ })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('option', { name: /2026-0041/ })).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{Escape}')
    expect(onOpenChange).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('draws nothing under its field while it has no entries and nothing is typed', () => {
    render(<SpotlightSearch open onOpenChange={() => {}} label="Go to" />)
    expect(screen.queryByText(/No results/)).toBeNull()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })
})

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SpotlightSearch in a language', () => {
  const french = (node: ReactNode) => (
    <IoitiProvider locale="fr-FR" messages={fr}>
      {node}
    </IoitiProvider>
  )

  it('says its words in the language given: its name, its field, its headings, what it found', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem('ioiti.theme.spotlight.go-to', JSON.stringify([{ id: 'charts', title: 'Charts', category: 'Pages', href: '/charts' }]))
    render(french(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} remember="go-to" recentSearches={['brun']} limit={2} />))

    const dialog = screen.getByRole('dialog', { name: 'Recherche rapide' })
    const field = within(dialog).getByRole('combobox', { name: 'Rechercher' })
    expect(field).toHaveAttribute('placeholder', 'Rechercher…')
    expect(within(dialog).getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    expect(within(dialog).getByRole('group', { name: 'Récents' })).toBeInTheDocument()
    expect(within(dialog).getByRole('group', { name: 'Recherches récentes' })).toBeInTheDocument()
    expect(screen.getByText('1 autre résultat : précisez votre recherche.').textContent).toBe('1 autre résultat\u00a0: précisez votre recherche.')

    await waitFor(() => expect(field).toHaveFocus())
    await user.keyboard('or')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('2 résultats'))
    await user.keyboard('zz')
    // The query in the words that say nothing was found for it, in the text's colour.
    const none = screen.getByText(/Aucun résultat pour/)
    expect(none.textContent).toBe('Aucun résultat pour «\u00a0orzz\u00a0»')
    expect(within(none).getByText('orzz')).toHaveClass('text-foreground')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^Aucun résultat$/))
  })

  it("says an entry's list in the language given: what it opens, its field, the way back, what it found", async () => {
    const user = userEvent.setup()
    render(french(<SpotlightSearch open onOpenChange={() => {}} items={LISTS} onNavigate={() => {}} label="Aller à" />))
    expect(screen.getByRole('option', { name: /Orders/ })).toHaveAccessibleDescription('Ouvre sa liste')
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Rechercher' })).toHaveFocus())
    await user.keyboard('ord{Enter}')
    expect(screen.getByRole('combobox', { name: 'Rechercher dans Orders' })).toHaveValue('')
    expect(screen.getByRole('button', { name: /^Sortir de/ })).toHaveAccessibleName('Sortir de «\u00a0Orders\u00a0»')
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Orders\u00a0: 2 résultats'))
  })

  it('says it searches, and that the search failed, in the language given', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()
    const { rerender } = render(french(<SpotlightSearch open onOpenChange={() => {}} filter={false} loading label="Aller à" />))
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Rechercher' })).toHaveFocus())
    await user.keyboard('acme')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Recherche en cours…'))

    rerender(french(<SpotlightSearch open onOpenChange={() => {}} filter={false} error onRetry={retry} label="Aller à" />))
    expect(screen.getByText('La recherche a échoué.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Réessayer' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('is listed among the shortcuts in the language given', () => {
    function Listed() {
      const registry = useShortcutRegistry()
      const shortcuts = useSyncExternalStore(registry.subscribe, registry.list)
      return <p data-testid="listed">{shortcuts.map((shortcut) => `${shortcut.keys} ${shortcut.description} ${shortcut.group}`).join(', ')}</p>
    }
    render(
      french(
        <>
          <SpotlightSearch enableGlobalShortcut items={ITEMS} />
          <Listed />
        </>,
      ),
    )
    expect(screen.getByTestId('listed')).toHaveTextContent('mod+k Recherche rapide Navigation')
  })

  it("takes an application's own words over English's, and its props over both", () => {
    const { unmount } = render(
      <IoitiProvider messages={{ search: { placeholder: 'Find a page…', results: ({ count }: { count: number; more: number }) => `${count} found` } }}>
        <SpotlightSearch open onOpenChange={() => {}} items={ITEMS} />
      </IoitiProvider>,
    )
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveAttribute('placeholder', 'Find a page…')
    expect(screen.getByRole('dialog', { name: 'Spotlight Search' })).toBeInTheDocument()
    unmount()

    render(french(<SpotlightSearch open onOpenChange={() => {}} items={ITEMS} placeholder="Une page…" label="Aller à" />))
    expect(screen.getByRole('dialog', { name: 'Aller à' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Rechercher' })).toHaveAttribute('placeholder', 'Une page…')
  })
})
