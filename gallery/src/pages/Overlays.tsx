import {
  Button,
  buttonClassName,
  Checkbox,
  DirectionalTooltip,
  DynamicIsland,
  Flysheet,
  FlysheetBody,
  FlysheetClose,
  FlysheetContent,
  FlysheetDescription,
  FlysheetFooter,
  FlysheetHeader,
  FlysheetTitle,
  FlysheetTrigger,
  NotificationBell,
  PageHeader,
  PeekCard,
  PeekLink,
  SettleModal,
  SignedValue,
  SpotlightSearch,
  Textarea,
} from 'ioiti-ui'
import type { Notification } from 'ioiti-ui'
import { useState } from 'react'

import { Demo } from '../parts'

const MINUTE = 60_000

function InvoicePreview() {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">Invoice 2026-0042</p>
      <p className="text-xs text-muted-foreground">Acme · due on 30 Oct</p>
      <p className="font-semibold tabular-nums">1,840.00 €</p>
    </div>
  )
}

function Dialogs() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null)
  return (
    <>
      {(['sm', 'md', 'lg', 'xl'] as const).map((each) => (
        <Button key={each} size="sm" variant="outline" onClick={() => setSize(each)}>
          {each}
        </Button>
      ))}
      <SettleModal
        open={size !== null}
        onClose={() => setSize(null)}
        size={size ?? 'md'}
        title="Rename the project"
        description="Its address stays the same: links to it keep working."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSize(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setSize(null)}>
              Rename
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Drawn in the document's body, whatever opened it; the focus moves in, stays in, and goes back to what opened it.
          Escape or a click outside closes it.
        </p>
      </SettleModal>
    </>
  )
}

const LINES = [
  { item: 'Standing desk', quantity: 2, amount: '1,240.00 €' },
  { item: 'Desk lamp', quantity: 4, amount: '360.00 €' },
  { item: 'Delivery', quantity: 1, amount: '240.00 €' },
]

function Sheets() {
  const trigger = buttonClassName({ variant: 'outline', size: 'sm' })
  return (
    <>
      <Flysheet>
        <FlysheetTrigger className={trigger}>An order</FlysheetTrigger>
        <FlysheetContent resizable>
          <FlysheetHeader>
            <FlysheetTitle>Order 2026-0042</FlysheetTitle>
            <FlysheetDescription>Placed on 26 Oct by Acme. Drag its edge, or use the arrow keys on it, to widen it.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody className="space-y-4">
            <dl className="divide-y divide-border text-sm">
              {LINES.map((line) => (
                <div key={line.item} className="flex items-baseline justify-between gap-4 py-2">
                  <dt>
                    {line.item} <span className="text-muted-foreground">× {line.quantity}</span>
                  </dt>
                  <dd className="tabular-nums">{line.amount}</dd>
                </div>
              ))}
            </dl>
            <Flysheet>
              <FlysheetTrigger className={trigger}>Acme, the customer</FlysheetTrigger>
              <FlysheetContent size="sm">
                <FlysheetHeader>
                  <FlysheetTitle>Acme</FlysheetTitle>
                  <FlysheetDescription>A customer since 2021: 14 orders, 18,420.00 €.</FlysheetDescription>
                </FlysheetHeader>
                <FlysheetBody>
                  <p className="text-sm text-muted-foreground">
                    A child sheet: beside the order while the window has room for both, over it otherwise. Escape closes it
                    first; closing the order closes it too.
                  </p>
                </FlysheetBody>
              </FlysheetContent>
            </Flysheet>
          </FlysheetBody>
          <FlysheetFooter>
            <FlysheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</FlysheetClose>
            <Button size="sm">Send the invoice</Button>
          </FlysheetFooter>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>Notes, beside the page</FlysheetTrigger>
        <FlysheetContent type="push" size="sm" resizable>
          <FlysheetHeader>
            <FlysheetTitle>Notes</FlysheetTitle>
            <FlysheetDescription>
              From a window 1024 px wide, the page makes room for them and stays in use; on a narrower one, they cover it.
            </FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody>
            <Textarea rows={6} aria-label="Notes" placeholder="What the next person should know" />
          </FlysheetBody>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>Filters, from the left</FlysheetTrigger>
        <FlysheetContent side="left" size="sm" closePosition="outside">
          <FlysheetHeader>
            <FlysheetTitle>Filters</FlysheetTitle>
            <FlysheetDescription>Its close button outside it, over the page.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody className="space-y-3 py-3">
            {['Open', 'Sent', 'Late'].map((status) => (
              <Checkbox key={status} label={status} defaultChecked={status !== 'Late'} />
            ))}
          </FlysheetBody>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>Without a backdrop</FlysheetTrigger>
        <FlysheetContent modal={false} size="sm">
          <FlysheetHeader>
            <FlysheetTitle>Help</FlysheetTitle>
            <FlysheetDescription>The page stays in use under it: its trigger closes it, and Escape while the focus is in it.</FlysheetDescription>
          </FlysheetHeader>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>From the bottom</FlysheetTrigger>
        <FlysheetContent side="bottom">
          <FlysheetHeader>
            <FlysheetTitle>Share the order</FlysheetTitle>
            <FlysheetDescription>EasyUI's sheet, dragged down by its handle to close it.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetFooter>
            <FlysheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</FlysheetClose>
            <Button size="sm">Copy the link</Button>
          </FlysheetFooter>
        </FlysheetContent>
      </Flysheet>
    </>
  )
}

function Bell() {
  const [items, setItems] = useState<Notification[]>(() => [
    { id: '1', message: 'Export ready', detail: 'orders-2026-10-26.csv', timestamp: new Date(Date.now() - 2 * MINUTE), read: false, href: '/components/data', tone: 'success' },
    { id: '2', message: 'Payment refused', detail: 'Order 2026-0042', timestamp: new Date(Date.now() - 14 * MINUTE), read: false, href: '/components/feedback', tone: 'danger' },
    { id: '3', message: 'Weekly summary sent', timestamp: new Date(Date.now() - 3 * 60 * MINUTE), read: true },
  ])
  const markRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)))
  return (
    <NotificationBell
      notifications={items}
      onMarkAsRead={markRead}
      onMarkAllAsRead={() => setItems((list) => list.map((item) => ({ ...item, read: true })))}
      footer={<p className="px-4 py-2 text-xs text-muted-foreground">Kept for this tab.</p>}
    />
  )
}

function Palette() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Open a palette
      </Button>
      <SpotlightSearch
        open={open}
        onOpenChange={setOpen}
        label="Go to"
        placeholder="An order, a customer…"
        items={[
          { id: 'o42', title: 'Order 2026-0042', category: 'Orders', description: 'Acme · 1,840.00 €', href: '/components/data', keywords: ['acme'] },
          { id: 'o41', title: 'Order 2026-0041', category: 'Orders', description: 'Globex · 960.50 €', href: '/components/data' },
          { id: 'c1', title: 'Acme', category: 'Customers', href: '/components/data' },
          { id: 'p1', title: 'Forms', category: 'Pages', href: '/components/forms' },
        ]}
      />
    </>
  )
}

export function Overlays() {
  return (
    <>
      <PageHeader title="Overlays" description="What appears over the page: drawn in the document's body, kept on the screen, closed by Escape, a tap elsewhere or a scroll." />

      <Demo
        id="tooltip"
        title="DirectionalTooltip"
        description="The tooltip under Hint: on the side asked, or the other one when there is no room, its arrow on its trigger. Hint is what pages use."
        names={['DirectionalTooltip']}
      >
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <DirectionalTooltip key={side} content={`On the ${side}`} side={side}>
            <Button size="sm" variant="outline">
              {side}
            </Button>
          </DirectionalTooltip>
        ))}
      </Demo>

      <Demo
        id="peek"
        title="PeekLink and PeekCard"
        description="A link whose page is previewed on hover, on keyboard focus and on a first tap, without leaving the page; a second tap, or a click, follows it."
        names={['PeekLink', 'PeekCard']}
      >
        <PeekLink to="/components/data" content={() => <InvoicePreview />} className="text-sm font-medium underline underline-offset-2">
          Invoice 2026-0042
        </PeekLink>
        <PeekCard renderContent={() => <InvoicePreview />} href="/components/data">
          <button type="button" className="rounded-full border border-border px-2.5 py-0.5 text-xs">
            1,840.00 €
          </button>
        </PeekCard>
      </Demo>

      <Demo id="dialog" title="SettleModal" description="A dialog, in four widths (and a full one, for two things side by side)." names={['SettleModal']}>
        <Dialogs />
      </Demo>

      <Demo
        id="flysheet"
        title="Flysheet"
        description="EasyUI's sheet with Elastic's flyout: from any side, swiped away on a touch screen; a side sheet in three widths or any, widened by its edge or the arrow keys on it; beside the page instead of over it; with or without a backdrop; a child sheet beside its parent, or over it on a narrow screen."
        names={['Flysheet', 'FlysheetTrigger', 'FlysheetContent', 'FlysheetHeader', 'FlysheetTitle', 'FlysheetDescription', 'FlysheetBody', 'FlysheetFooter', 'FlysheetClose']}
      >
        <Sheets />
      </Demo>

      <Demo id="bell" title="NotificationBell" description="What happened while the page was open, newest first, each leading where it is dealt with; only what is urgent pulses." names={['NotificationBell']}>
        <Bell />
      </Demo>

      <Demo id="spotlight" title="SpotlightSearch" description="A palette that goes somewhere: every word typed must be in an entry, Enter follows it. The gallery's own is in its top bar (⌘K)." names={['SpotlightSearch']}>
        <Palette />
      </Demo>

      <Demo
        id="island"
        title="DynamicIsland"
        description="A pill that keeps its place in the top bar and grows into an island over the page: what is live, everywhere."
        names={['DynamicIsland']}
      >
        <DynamicIsland
          label="Today"
          compact={
            <span className="flex items-center gap-2 text-xs">
              <span className="size-1.5 rounded-full bg-positive" aria-hidden />
              3 orders · <SignedValue value={12.4} kind="percent" />
            </span>
          }
        >
          <div className="space-y-2 p-4 text-sm">
            <p className="font-medium">Today</p>
            <p className="text-muted-foreground">3 orders, 4,210.00 €: 12.4 % more than last Monday.</p>
          </div>
        </DynamicIsland>
      </Demo>
    </>
  )
}
