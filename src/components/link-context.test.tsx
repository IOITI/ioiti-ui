import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps, ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { LinkProvider } from './LinkProvider.js'
import { AnimatedTabs } from './ui/animated-tabs.js'
import { Breadcrumb } from './ui/breadcrumb.js'
import { NotFound } from './ui/not-found.js'
import { NotificationBell } from './ui/notification-bell.js'
import { PeekCard } from './ui/peek-card.js'
import { RequestStatus } from './ui/request-status.js'
import { SelectionBasket } from './ui/selection-basket.js'
import { Sidebar } from './ui/sidebar.js'
import { SmartComparison } from './ui/smart-comparison.js'
import { SplitButton } from './ui/split-button.js'
import { SpotlightSearch } from './ui/spotlight-search.js'

/** The application's link, as a router's would be: marked, to be told from a plain `<a>`. */
function AppLink(props: ComponentProps<'a'>) {
  return <a data-link="app" {...props} />
}

/** A link a component is given for itself. */
function OwnLink(props: ComponentProps<'a'>) {
  return <a data-link="own" {...props} />
}

const withApp = (element: ReactElement) => render(<LinkProvider component={AppLink}>{element}</LinkProvider>)
const drawnBy = (link: HTMLElement) => link.getAttribute('data-link') ?? 'a'

// Each component that draws a link, as it shows one without being touched.
const LINKS: { name: string; element: ReactElement; link: string }[] = [
  { name: 'Sidebar', element: <Sidebar sections={[{ items: [{ id: 'orders', label: 'Orders', href: '/orders' }] }]} activeId="" />, link: 'Orders' },
  { name: 'AnimatedTabs', element: <AnimatedTabs tabs={[{ id: 'open', label: 'Open', href: '?status=open' }, { id: 'all', label: 'All', href: '?status=all' }]} />, link: 'All' },
  { name: 'Breadcrumb', element: <Breadcrumb items={[{ label: 'Library', href: '/library' }, { label: 'Here' }]} />, link: 'Library' },
  { name: 'NotFound', element: <NotFound path="/x" suggestions={[{ label: 'Files', href: '/files' }]} />, link: 'Files' },
  { name: 'SelectionBasket', element: <SelectionBasket selectedCount={2} actions={[{ id: 'compare', label: 'Compare', href: '/compare' }]} />, link: 'Compare' },
  {
    name: 'SmartComparison',
    element: (
      <SmartComparison
        plans={[
          { id: 'a', name: 'First', tagline: '', price: '', href: '/runs/a' },
          { id: 'b', name: 'Second', tagline: '', price: '', href: '/runs/b' },
        ]}
        categories={[{ id: 'c', title: 'Figures', features: [{ id: 'f', name: 'Total', values: { a: '1', b: '2' } }] }]}
      />
    ),
    link: 'First',
  },
  { name: 'RequestStatus', element: <RequestStatus status="success" title="Order sent" link={{ href: '/orders/7', label: 'See the order' }} />, link: 'See the order' },
  { name: 'SplitButton', element: <SplitButton label="Run it" href="/run" options={[]} />, link: 'Run it' },
  {
    name: 'NotificationBell',
    element: (
      <NotificationBell
        isOpen
        notifications={[{ id: '1', message: 'Export ready', timestamp: new Date(), read: false, href: '/exports/1' }]}
        onMarkAsRead={() => {}}
      />
    ),
    link: 'Export ready',
  },
  {
    name: 'SpotlightSearch',
    element: <SpotlightSearch open items={[{ id: 'orders', title: 'Orders', category: 'Pages', href: '/orders' }]} onOpenChange={() => {}} />,
    link: 'Orders',
  },
]

describe('a component that draws a link', () => {
  for (const { name, element, link } of LINKS) {
    it(`draws it with the application's link: ${name}`, () => {
      withApp(element)
      const name = new RegExp(link)
      // A link, or an option of a list that is a link (the palette's).
      const found = [...screen.queryAllByRole('link', { name }), ...screen.queryAllByRole('option', { name })]
      expect(found.length).toBeGreaterThan(0)
      expect(drawnBy(found[0])).toBe('app')
    })
  }

  it('keeps a link it was given for itself', () => {
    withApp(
      <>
        <Sidebar sections={[{ items: [{ id: 'orders', label: 'Orders', href: '/orders' }] }]} activeId="" linkComponent={OwnLink} />
        <Breadcrumb as={OwnLink} items={[{ label: 'Library', href: '/library' }, { label: 'Here' }]} />
        <NotFound path="/x" LinkComponent={OwnLink} suggestions={[{ label: 'Files', href: '/files' }]} />
      </>,
    )

    expect(drawnBy(screen.getByRole('link', { name: 'Orders' }))).toBe('own')
    expect(drawnBy(screen.getByRole('link', { name: 'Library' }))).toBe('own')
    expect(drawnBy(screen.getByRole('link', { name: /Files/ }))).toBe('own')
  })

  it('draws a plain link without an application around it', () => {
    render(<Sidebar sections={[{ items: [{ id: 'orders', label: 'Orders', href: '/orders' }] }]} activeId="" />)

    const link = screen.getByRole('link', { name: 'Orders' })
    expect(drawnBy(link)).toBe('a')
    expect(link).toHaveAttribute('href', '/orders')
  })

  it('draws the card of a link previewed with the application\'s link too', async () => {
    const user = userEvent.setup()
    withApp(
      <PeekCard renderContent={() => <p>Due on 30 Oct</p>} href="/invoices/42">
        <button type="button">Invoice 42</button>
      </PeekCard>,
    )

    await user.tab()
    expect(await screen.findByText('Due on 30 Oct')).toBeInTheDocument()
    expect(drawnBy(screen.getByRole('link', { name: 'Open' }))).toBe('app')
  })
})
