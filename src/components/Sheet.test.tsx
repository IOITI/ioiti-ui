import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { fr } from '../locales/fr.js'
import { DropdownMenu } from './DropdownMenu.js'
import { IoitiProvider } from './IoitiProvider.js'
import { Button } from './ui/button.js'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/flysheet.js'
import type { SheetCloseReason, SheetContentProps } from './ui/flysheet.js'
import { Dialog } from './ui/settle-modal.js'

type Change = (open: boolean, details?: { reason: SheetCloseReason }) => void
type Options = Partial<Omit<SheetContentProps, 'children'>>

/** An order's sheet, as a page has it: a title, a description, a button of its own; a customer's sheet in it. */
function Order({ onOpenChange, onChildChange, child, inside, ...props }: Options & { onOpenChange?: Change; onChildChange?: Change; child?: Options; inside?: ReactNode }) {
  return (
    <>
      <button type="button">On the page</button>
      <Sheet onOpenChange={onOpenChange}>
        <SheetTrigger>Open the order</SheetTrigger>
        <SheetContent {...props}>
          <SheetHeader>
            <SheetTitle>Order 2026-0042</SheetTitle>
            <SheetDescription>Acme, placed on 26 Oct</SheetDescription>
          </SheetHeader>
          <SheetBody>
            {inside}
            {child && (
              <Sheet onOpenChange={onChildChange}>
                <SheetTrigger>Open the customer</SheetTrigger>
                <SheetContent {...child}>
                  <SheetHeader>
                    <SheetTitle>Acme</SheetTitle>
                  </SheetHeader>
                  <SheetBody>
                    <button type="button">Call Acme</button>
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
          </SheetBody>
          <SheetFooter>
            <SheetClose>Done</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

const WINDOW_WIDTH = window.innerWidth
function setWindowWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
}
afterEach(() => setWindowWidth(WINDOW_WIDTH))

const opener = () => screen.getByRole('button', { name: 'Open the order' })
const gone = (role: 'dialog' | 'region' | 'group') => waitFor(() => expect(screen.queryByRole(role)).not.toBeInTheDocument())

describe('the sheet (EasyUI’s, with Elastic’s flyout)', () => {
  it('opens from its trigger as a dialog named by its title, and gives the focus back when Escape closes it', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Order onOpenChange={onOpenChange} />)
    expect(opener()).toHaveAttribute('aria-expanded', 'false')

    await user.click(opener())
    const dialog = screen.getByRole('dialog', { name: 'Order 2026-0042' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('Acme, placed on 26 Oct')
    expect(dialog).toHaveFocus()
    expect(opener()).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'escape' })
    await gone('dialog')
    expect(opener()).toHaveFocus()
  })

  it('says why it closed: its close button, a click outside, a button of its own', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Order onOpenChange={onOpenChange} />)

    await user.click(opener())
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'close-button' })
    await gone('dialog')

    await user.click(opener())
    // The backdrop, the first thing in the dialog's layer.
    await user.click(screen.getByRole('dialog').firstElementChild as HTMLElement)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'outside-click' })
    await gone('dialog')

    await user.click(opener())
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'close-button' })
  })

  it('stays open on a click on its backdrop when told to', async () => {
    const user = userEvent.setup()
    render(<Order closeOnOutsideClick={false} />)

    await user.click(opener())
    await user.click(screen.getByRole('dialog').firstElementChild as HTMLElement)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('leaves an Escape meant for a list open in it to that list', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Order
        onOpenChange={onOpenChange}
        inside={
          <button type="button" aria-haspopup="listbox" aria-expanded="true">
            Status
          </button>
        }
      />,
    )

    await user.click(opener())
    await user.click(screen.getByRole('button', { name: 'Status' }))
    await user.keyboard('{Escape}')
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('is resized from its edge, by the keyboard or the pointer, within its limits, and says so', async () => {
    const user = userEvent.setup()
    const onResize = vi.fn()
    render(<Order resizable size={400} minWidth={300} maxWidth={500} onResize={onResize} />)

    await user.click(opener())
    const edge = screen.getByRole('separator', { name: 'Resize' })
    const panel = document.getElementById(edge.getAttribute('aria-controls') ?? '') as HTMLElement
    expect(edge).toHaveAttribute('aria-valuenow', '400')
    expect(panel.style.width).toBe('400px')

    edge.focus()
    await user.keyboard('{ArrowLeft}')
    expect(edge).toHaveAttribute('aria-valuenow', '410')
    expect(panel.style.width).toBe('410px')
    expect(onResize).toHaveBeenLastCalledWith(410)
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    expect(edge).toHaveAttribute('aria-valuenow', '460')
    await user.keyboard('{End}')
    expect(edge).toHaveAttribute('aria-valuenow', '500')
    // At its widest: nothing changes, nothing is said.
    await user.keyboard('{ArrowLeft}')
    expect(onResize).toHaveBeenCalledTimes(3)
    await user.keyboard('{Home}')
    expect(edge).toHaveAttribute('aria-valuenow', '300')

    // Dragged 40 px towards the page, from the right side: 40 px wider.
    fireEvent.pointerDown(edge, { button: 0, clientX: 600, pointerId: 1 })
    fireEvent.pointerMove(edge, { clientX: 560, pointerId: 1 })
    fireEvent.pointerUp(edge, { clientX: 560, pointerId: 1 })
    expect(edge).toHaveAttribute('aria-valuenow', '340')
    expect(onResize).toHaveBeenLastCalledWith(340)
  })

  it('pushes the page aside from a window wide enough, and covers it on a narrower one', async () => {
    const user = userEvent.setup()
    setWindowWidth(1280)
    render(<Order type="push" size={400} />)

    await user.click(opener())
    // A region of the page, not a dialog: no backdrop, the focus free.
    const region = screen.getByRole('region', { name: 'Order 2026-0042' })
    expect(region).not.toHaveAttribute('aria-modal')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.marginRight).toBe('400px')
    expect(document.documentElement.style.getPropertyValue('--flysheet-push-right')).toBe('400px')

    // Its trigger stays in reach, and closes it.
    await user.click(opener())
    await gone('region')
    expect(document.body.style.marginRight).toBe('')
    expect(document.documentElement.style.getPropertyValue('--flysheet-push-right')).toBe('')

    setWindowWidth(900)
    await user.click(opener())
    expect(screen.getByRole('dialog', { name: 'Order 2026-0042' })).toHaveAttribute('aria-modal', 'true')
    expect(document.body.style.marginRight).toBe('')
  })

  it('opens a child beside its parent, in its dialog, closes it first, and with its parent', async () => {
    const user = userEvent.setup()
    setWindowWidth(1280)
    const onChildChange = vi.fn()
    render(<Order size={400} child={{ size: 360 }} onChildChange={onChildChange} />)

    await user.click(opener())
    const customer = screen.getByRole('button', { name: 'Open the customer' })
    await user.click(customer)
    const dialog = screen.getByRole('dialog', { name: 'Order 2026-0042' })
    const child = within(dialog).getByRole('group', { name: 'Acme' })
    expect(child).toHaveFocus()
    expect(child.style.right).toBe('400px')
    expect(child.style.width).toBe('360px')

    // Escape closes the child alone, and the focus goes back to what opened it.
    await user.keyboard('{Escape}')
    expect(onChildChange).toHaveBeenLastCalledWith(false, { reason: 'escape' })
    await gone('group')
    expect(customer).toHaveFocus()
    expect(dialog).toBeInTheDocument()

    // Closing the parent closes the child, and says why.
    await user.click(customer)
    const parentClose = within(dialog)
      .getAllByRole('button', { name: 'Close' })
      .find((button) => !button.closest('[role="group"]')) as HTMLElement
    await user.click(parentClose)
    expect(onChildChange).toHaveBeenLastCalledWith(false, { reason: 'parent' })
    await gone('dialog')
    expect(opener()).toHaveFocus()
  })

  it('lays a child over its parent where there is no room beside it, leaving nothing of the parent in reach', async () => {
    const user = userEvent.setup()
    // 88 % of 700 px: 616, too narrow for 400 and 360 side by side.
    setWindowWidth(700)
    render(<Order size={400} child={{ size: 360 }} />)

    await user.click(opener())
    const customer = screen.getByRole('button', { name: 'Open the customer' })
    await user.click(customer)
    const child = screen.getByRole('group', { name: 'Acme' })
    expect(child.style.right).toBe('0px')
    expect(child.style.width).toBe('400px')
    expect(customer.closest('[inert]')).not.toBeNull()

    await user.click(within(child).getByRole('button', { name: 'Close' }))
    expect(customer.closest('[inert]')).toBeNull()
    expect(customer).toHaveFocus()
  })

  it('leaves the page in use when it is not modal, closing on a click there only when asked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { unmount } = render(<Order modal={false} onOpenChange={onOpenChange} />)

    await user.click(opener())
    expect(screen.getByRole('dialog', { name: 'Order 2026-0042' })).not.toHaveAttribute('aria-modal')
    await user.click(screen.getByRole('button', { name: 'On the page' }))
    // An Escape on the page is the page's.
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Its trigger closes it.
    await user.click(opener())
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'trigger' })
    unmount()

    render(<Order modal={false} closeOnOutsideClick onOpenChange={onOpenChange} />)
    await user.click(opener())
    await user.click(screen.getByRole('button', { name: 'On the page' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'outside-click' })
  })
})

describe('a sheet’s focus, kept as every layer keeps it', () => {
  it('holds the page: in on its dialog, Tab and Shift+Tab round its controls (from the page too), back on what opened it', async () => {
    const user = userEvent.setup()
    render(<Order />)
    await user.click(opener())
    const dialog = screen.getByRole('dialog', { name: 'Order 2026-0042' })
    expect(dialog).toHaveFocus()
    const done = screen.getByRole('button', { name: 'Done' })
    const close = screen.getByRole('button', { name: 'Close' })
    await user.tab()
    expect(done).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
    await user.tab()
    expect(done).toHaveFocus()
    await user.tab({ shift: true })
    expect(close).toHaveFocus()
    // The focus on the page (moved there by a script): Tab brings it back into the sheet.
    act(() => screen.getByRole('button', { name: 'On the page' }).focus())
    await user.tab()
    expect(done).toHaveFocus()

    await user.click(close)
    await gone('dialog')
    expect(opener()).toHaveFocus()
  })

  it('keeps the focus in a child while it is open, Tab round it alone, then in its parent again', async () => {
    const user = userEvent.setup()
    setWindowWidth(1280)
    render(<Order size={400} child={{ size: 360 }} />)
    await user.click(opener())
    const customer = screen.getByRole('button', { name: 'Open the customer' })
    await user.click(customer)
    const child = screen.getByRole('group', { name: 'Acme' })
    expect(child).toHaveFocus()
    // Beside its parent, which stays in reach of the pointer.
    expect(child.style.right).toBe('400px')
    const call = within(child).getByRole('button', { name: 'Call Acme' })
    const childClose = within(child).getByRole('button', { name: 'Close' })
    await user.tab()
    expect(call).toHaveFocus()
    await user.tab()
    expect(childClose).toHaveFocus()
    await user.tab()
    expect(call).toHaveFocus()
    await user.tab({ shift: true })
    expect(childClose).toHaveFocus()
    // The focus moved into the parent beside it: Tab brings it back into the child, the latest opened.
    act(() => screen.getByRole('button', { name: 'Done' }).focus())
    await user.tab()
    expect(call).toHaveFocus()

    // Closed, its parent keeps the focus again: back on what opened the child, Tab round the parent's controls.
    await user.keyboard('{Escape}')
    await gone('group')
    expect(customer).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.tab()
    expect(customer).toHaveFocus()
  })

  it('leaves the focus free beside a sheet without a backdrop: in as it opens, Tab on out of it, Escape from within, given back', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Order modal={false} onOpenChange={onOpenChange} />)
    await user.click(opener())
    const sheet = screen.getByRole('dialog', { name: 'Order 2026-0042' })
    expect(sheet).toHaveFocus()
    // Nothing keeps Tab in it: past its last control, the focus goes on out of it.
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.tab()
    expect(document.body).toHaveFocus()
    // Escape from within closes it, the focus back on its trigger.
    act(() => screen.getByRole('button', { name: 'Done' }).focus())
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'escape' })
    await gone('dialog')
    expect(opener()).toHaveFocus()
  })

  it('takes no focus from the page when it opens with it, without a backdrop; opened again, it takes it', async () => {
    const user = userEvent.setup()
    function Later({ shown }: { shown: boolean }) {
      return (
        <>
          <button type="button">On the page</button>
          {shown && (
            <Sheet defaultOpen>
              <SheetTrigger>Help</SheetTrigger>
              <SheetContent modal={false} aria-label="Help">
                <SheetBody>
                  <p>How an order is sent.</p>
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </>
      )
    }
    const { rerender } = render(<Later shown={false} />)
    const page = screen.getByRole('button', { name: 'On the page' })
    act(() => page.focus())
    rerender(<Later shown />)
    expect(screen.getByRole('dialog', { name: 'Help' })).toBeInTheDocument()
    expect(page).toHaveFocus()

    const trigger = screen.getByRole('button', { name: 'Help' })
    await user.click(trigger)
    await gone('dialog')
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Help' })).toHaveFocus()
  })

  it('leaves an Escape to a menu open in it, and to a dialog opened from it: the latest layer opened closes first', async () => {
    const user = userEvent.setup()
    function Cancel() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Cancel the order
          </button>
          <Dialog open={open} onOpenChange={setOpen} title="Cancel order 2026-0042?" />
        </>
      )
    }
    const onOpenChange = vi.fn()
    render(
      <Order
        onOpenChange={onOpenChange}
        inside={
          <>
            <DropdownMenu label="Order actions" trigger={<Button>More</Button>} items={[{ label: 'Duplicate', onSelect: () => {} }]} />
            <Cancel />
          </>
        }
      />,
    )
    await user.click(opener())
    const sheet = screen.getByRole('dialog', { name: 'Order 2026-0042' })

    const more = screen.getByRole('button', { name: 'More' })
    await user.click(more)
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(more).toHaveFocus()
    expect(sheet).toBeInTheDocument()

    const cancel = screen.getByRole('button', { name: 'Cancel the order' })
    await user.click(cancel)
    expect(screen.getByRole('dialog', { name: 'Cancel order 2026-0042?' })).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Cancel order 2026-0042?' })).not.toBeInTheDocument())
    expect(cancel).toHaveFocus()
    expect(onOpenChange).not.toHaveBeenCalledWith(false, expect.anything())

    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'escape' })
  })
})

// What the package says of a former name, once, in development.
const DEPRECATED = /^ioiti-ui: a name or a value the package deprecated/
const deprecations = (warn: { mock: { calls: unknown[][] } }) => warn.mock.calls.filter(([message]) => DEPRECATED.test(String(message)))

describe('a sheet’s close button', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is there unless showCloseButton is false, nothing said of it', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { unmount } = render(<Order />)
    await user.click(opener())
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    unmount()

    render(<Order showCloseButton={false} />)
    await user.click(opener())
    expect(screen.getByRole('dialog', { name: 'Order 2026-0042' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    expect(deprecations(warn)).toHaveLength(0)
  })

  it('still takes showClose, said once in development, showCloseButton over it', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { unmount } = render(<Order showClose={false} />)
    await user.click(opener())
    expect(screen.getByRole('dialog', { name: 'Order 2026-0042' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
    const said = deprecations(warn)
    expect(said).toHaveLength(1)
    expect(String(said[0][0])).toContain("(SheetContent's showClose: showCloseButton)")
    unmount()

    render(<Order showClose={false} showCloseButton />)
    await user.click(opener())
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})

describe('a sheet’s body, scrolled', () => {
  it('fades out under the header as tall as it scrolled, up to 32 px, and not at rest', async () => {
    const user = userEvent.setup()
    const scrolls = vi.fn()
    let held: HTMLDivElement | null = null
    render(
      <Sheet>
        <SheetTrigger>Open the order</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Order 2026-0042</SheetTitle>
          </SheetHeader>
          <SheetBody data-testid="body" onScroll={scrolls} ref={(node) => void (held = node)}>
            <p>The order’s lines</p>
          </SheetBody>
        </SheetContent>
      </Sheet>,
    )
    await user.click(screen.getByRole('button', { name: 'Open the order' }))
    const body = await screen.findByTestId('body')
    expect(held).toBe(body) // its ref is the caller's still
    expect(body).not.toHaveAttribute('data-scrolled')

    const scrollTo = (top: number) => {
      body.scrollTop = top
      fireEvent.scroll(body)
    }
    scrollTo(10)
    expect(body).toHaveAttribute('data-scrolled')
    expect(body.style.getPropertyValue('--flysheet-fade')).toBe('10px')
    scrollTo(300)
    expect(body.style.getPropertyValue('--flysheet-fade')).toBe('32px')
    scrollTo(0)
    expect(body).not.toHaveAttribute('data-scrolled')
    expect(body.style.getPropertyValue('--flysheet-fade')).toBe('')
    expect(scrolls).toHaveBeenCalledTimes(3) // the caller's onScroll still told
  })
})

describe('a sheet in a language', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('names its controls in the language given, its width written in its locale', async () => {
    const user = userEvent.setup()
    setWindowWidth(1600)
    render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        <Order resizable size={1100} />
      </IoitiProvider>,
    )
    await user.click(opener())
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument()
    const edge = screen.getByRole('separator', { name: 'Redimensionner' })
    expect(edge).toHaveAttribute('aria-valuetext', '1\u202f100 px')
  })

  it('writes its width as English writes a number, its thousands grouped', async () => {
    const user = userEvent.setup()
    setWindowWidth(1600)
    render(<Order resizable size={1100} />)
    await user.click(opener())
    expect(screen.getByRole('separator', { name: 'Resize' })).toHaveAttribute('aria-valuetext', '1,100 px')
  })

  it("names a body without a title in the language given, or in an application's own word", async () => {
    const user = userEvent.setup()
    // jsdom lays nothing out: the body made taller than its box, so that it scrolls and is named.
    vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
      return this.getAttribute('data-testid') === 'body' ? 900 : 0
    })
    const sheet = (
      <Sheet>
        <SheetTrigger>Open the order</SheetTrigger>
        <SheetContent aria-label="Commande 2026-0042">
          <SheetBody data-testid="body">
            <p>Les lignes de la commande</p>
          </SheetBody>
        </SheetContent>
      </Sheet>
    )
    const { unmount } = render(
      <IoitiProvider locale="fr-FR" messages={fr}>
        {sheet}
      </IoitiProvider>,
    )
    await user.click(opener())
    expect(await screen.findByRole('region', { name: 'Contenu' })).toHaveTextContent('Les lignes de la commande')
    unmount()

    render(<IoitiProvider messages={{ dialog: { content: 'The order' } }}>{sheet}</IoitiProvider>)
    await user.click(opener())
    expect(await screen.findByRole('region', { name: 'The order' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
