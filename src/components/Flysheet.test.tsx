import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  Flysheet,
  FlysheetBody,
  FlysheetClose,
  FlysheetContent,
  FlysheetDescription,
  FlysheetFooter,
  FlysheetHeader,
  FlysheetTitle,
  FlysheetTrigger,
} from './ui/flysheet.js'
import type { FlysheetCloseReason, FlysheetContentProps } from './ui/flysheet.js'

type Change = (open: boolean, details?: { reason: FlysheetCloseReason }) => void
type Options = Partial<Omit<FlysheetContentProps, 'children'>>

/** An order's sheet, as a page has it: a title, a description, a button of its own; a customer's sheet in it. */
function Order({ onOpenChange, onChildChange, child, inside, ...props }: Options & { onOpenChange?: Change; onChildChange?: Change; child?: Options; inside?: ReactNode }) {
  return (
    <>
      <button type="button">On the page</button>
      <Flysheet onOpenChange={onOpenChange}>
        <FlysheetTrigger>Open the order</FlysheetTrigger>
        <FlysheetContent {...props}>
          <FlysheetHeader>
            <FlysheetTitle>Order 2026-0042</FlysheetTitle>
            <FlysheetDescription>Acme, placed on 26 Oct</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody>
            {inside}
            {child && (
              <Flysheet onOpenChange={onChildChange}>
                <FlysheetTrigger>Open the customer</FlysheetTrigger>
                <FlysheetContent {...child}>
                  <FlysheetHeader>
                    <FlysheetTitle>Acme</FlysheetTitle>
                  </FlysheetHeader>
                  <FlysheetBody>
                    <button type="button">Call Acme</button>
                  </FlysheetBody>
                </FlysheetContent>
              </Flysheet>
            )}
          </FlysheetBody>
          <FlysheetFooter>
            <FlysheetClose>Done</FlysheetClose>
          </FlysheetFooter>
        </FlysheetContent>
      </Flysheet>
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

describe('the flysheet (EasyUI’s sheet, with Elastic’s flyout)', () => {
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
