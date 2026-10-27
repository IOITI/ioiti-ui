import { act, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'

import { useToast } from './toast-context.js'
import { ToastProvider } from './ToastProvider.js'
import { Flysheet, FlysheetContent, FlysheetTitle } from './ui/flysheet.js'
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
})
