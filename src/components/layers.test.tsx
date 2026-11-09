import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'

import { Hint } from './Hint.js'
import { useToast } from './toast-context.js'
import { ToastProvider } from './ToastProvider.js'
import { Flysheet, FlysheetContent, FlysheetTitle } from './ui/flysheet.js'
import { ProductTour } from './ui/product-tour.js'
import { SettleModal } from './ui/settle-modal.js'
import { Sidebar } from './ui/sidebar.js'
import { SpotlightSearch } from './ui/spotlight-search.js'

/**
 * A layer fixed over the page stays above it while it changes (over-page, src/styles/motion.css), named
 * while a transition plays only: a name at rest would make it the root of its glass's backdrop, which
 * would then blur nothing of the page behind it.
 */
function expectOverPage(layer: Element | null | undefined) {
  expect(layer).toHaveClass('over-page')
  expect((layer as HTMLElement).style.viewTransitionName).toBe('')
}

function ShowsAToast() {
  const toast = useToast()
  useEffect(() => toast({ title: 'Saved' }), [toast])
  return null
}

/** The layer an element is drawn on, read from its class (`z-50`, `z-[55]`): jsdom computes no style from it. */
function layerOf(element: Element | null | undefined): number {
  const match = /(?:^|\s)z-(?:(\d+)|\[(\d+)\])(?=\s|$)/.exec(element?.getAttribute('class') ?? '')
  if (!match) throw new Error(`No layer on ${element?.outerHTML.slice(0, 80) ?? 'nothing'}`)
  return Number(match[1] ?? match[2])
}

/** The frame of the toast shown ("Saved"), which holds its layer. */
const toastFrame = () => screen.getByText('Saved').closest('[role="status"]')?.parentElement

describe('the layers over the page', () => {
  it('are named only while a transition plays, the dialog\'s, the palette\'s and the drawer\'s', () => {
    render(
      <>
        <SettleModal open onClose={() => {}} title="Rename the project" />
        <SpotlightSearch open onOpenChange={() => {}} items={[]} label="Go to" />
        <Sidebar sections={[]} activeId="" mobileOpen onMobileOpenChange={() => {}} />
      </>,
    )

    expectOverPage(screen.getByRole('dialog', { name: 'Rename the project' }))
    expectOverPage(screen.getByRole('dialog', { name: 'Go to' }).parentElement)
    expectOverPage(screen.getByRole('dialog', { name: 'Navigation' }).parentElement)
  })

  it('are named only while a transition plays, the sheet\'s and the toasts\'', async () => {
    render(
      <ToastProvider>
        <ShowsAToast />
        <Flysheet defaultOpen>
          <FlysheetContent>
            <FlysheetTitle>Order 2026-0042</FlysheetTitle>
          </FlysheetContent>
        </Flysheet>
      </ToastProvider>,
    )
    await act(async () => {})

    expectOverPage(await screen.findByRole('dialog', { name: 'Order 2026-0042' }))
    expectOverPage(screen.getByRole('status').parentElement)
  })

  it('are named only while a transition plays, the tour\'s', async () => {
    render(<ProductTour open steps={[{ title: 'Welcome', body: 'A short tour.' }]} onClose={() => {}} />)
    const card = await screen.findByRole('dialog', { name: 'Welcome' })
    expectOverPage(card.parentElement)
  })

  it('draw a toast above a sheet, a dialog, the palette, the drawer and the tour: their scrims covered it', async () => {
    render(
      <ToastProvider>
        <ShowsAToast />
        <Flysheet defaultOpen>
          <FlysheetContent>
            <FlysheetTitle>Order 2026-0042</FlysheetTitle>
          </FlysheetContent>
        </Flysheet>
        <SettleModal open onClose={() => {}} title="Rename the project" />
        <SpotlightSearch open onOpenChange={() => {}} items={[]} label="Go to" />
        <Sidebar sections={[]} activeId="" mobileOpen onMobileOpenChange={() => {}} />
        <ProductTour open steps={[{ title: 'Welcome', body: 'A short tour.' }]} onClose={() => {}} />
      </ToastProvider>,
    )
    await act(async () => {})

    // Each comes after the page the toast is in (document.body, or later in the page): on the toast's layer, it
    // would be drawn over it.
    const toast = layerOf(toastFrame())
    expect(toast).toBeGreaterThan(layerOf(await screen.findByRole('dialog', { name: 'Order 2026-0042' })))
    expect(toast).toBeGreaterThan(layerOf(screen.getByRole('dialog', { name: 'Rename the project' })))
    expect(toast).toBeGreaterThan(layerOf(screen.getByRole('dialog', { name: 'Go to' }).parentElement))
    expect(toast).toBeGreaterThan(layerOf(screen.getByRole('dialog', { name: 'Navigation' }).parentElement))
    expect(toast).toBeGreaterThan(layerOf((await screen.findByRole('dialog', { name: 'Welcome' })).parentElement))
  })

  it('draw a hint above a toast', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <ShowsAToast />
        <Hint content="Switch it off before deleting it">
          <button type="button">Delete</button>
        </Hint>
      </ToastProvider>,
    )
    await user.tab()

    expect(layerOf(await screen.findByRole('tooltip', { hidden: true }))).toBeGreaterThan(layerOf(toastFrame()))
  })
})
