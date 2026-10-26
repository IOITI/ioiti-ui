import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogOut, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { IoitiProvider } from '../components/IoitiProvider.js'
import { PageHeader } from '../components/Panel.js'
import { RouterAppShell } from '../react-router/RouterAppShell.js'
import { RouterRoot } from '../react-router/RouterRoot.js'
import { MENU } from '../test/menu.js'
import { AppShell, SidebarFooterButton } from './AppShell.js'
import { NotFoundPage } from './NotFoundState.js'
import { StateChip } from './StateChip.js'

function Address() {
  const location = useLocation()
  return <output aria-label="address">{location.pathname + location.search}</output>
}

interface Options {
  /** The page shown. */
  path?: string
  chips?: ReactNode
  end?: ReactNode
  onSignOut?: () => void
}

/** An application on React Router, as the starter template builds one. */
function renderShell({ path = '/orders', chips, end, onSignOut }: Options = {}) {
  render(
    <IoitiProvider appName="Test App">
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<RouterRoot />}>
            <Route
              element={
                <RouterAppShell
                  menu={MENU}
                  appDetail="v1.2.0"
                  topBarChips={chips}
                  topBarEnd={end}
                  sidebarFooter={onSignOut && <SidebarFooterButton icon={<LogOut />} label="Sign out" onClick={onSignOut} />}
                />
              }
            >
              <Route index element={<PageHeader title="Dashboard" />} />
              <Route path="orders" element={<h1>Orders</h1>} />
              <Route
                path="library/assets/:key"
                element={
                  <>
                    <PageHeader title="Blue logo" />
                    <Link to="/orders">To the orders</Link>
                    <Link to="?side=back">The back</Link>
                  </>
                }
              />
              <Route
                path="reports/:id/days/:day"
                element={<PageHeader title="9 Oct 2026" parents={[{ label: 'October report', href: '/reports/r1' }]} />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
        <Address />
      </MemoryRouter>
    </IoitiProvider>,
  )
}

describe('the top bar', () => {
  it('carries the button that chooses the theme, on every page', async () => {
    renderShell()

    expect(await screen.findByRole('button', { name: /^Theme:/ })).toBeInTheDocument()
  })

  it('ends with what the application puts there, in place of the theme button', () => {
    renderShell({ end: <button type="button">Search</button> })

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Theme:/ })).not.toBeInTheDocument()
  })

  it('says on every page a state not to miss, and links to where it is dealt with', () => {
    renderShell({
      chips: (
        <StateChip
          to="/settings"
          tone="warning"
          icon={<TriangleAlert className="size-3.5" aria-hidden />}
          label="Restart needed"
          hint="The services run an older configuration: restart them from the settings."
        />
      ),
    })

    const chip = screen.getByRole('link', { name: 'Restart needed' })
    expect(chip).toHaveAttribute('href', '/settings')
    // Named by what it is, described by what it means (its hint, on hover, focus and a tap).
    expect(chip).toHaveAccessibleDescription(/older configuration/)
  })
})

/** Both forms of the trail are rendered here (no CSS): the whole one, then its last two steps. */
const trails = () => screen.getAllByRole('navigation', { name: 'Breadcrumb' })
const wholeTrail = () => within(trails()[0])
const shortTrail = () => within(trails()[1])
const isCurrent = (element: HTMLElement) => element.closest('[aria-current="page"]') !== null

describe('where the page is, in the top bar', () => {
  it('is said on every page: the section, which is no link, then the page, from Home', async () => {
    renderShell()

    expect(await wholeTrail().findByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(wholeTrail().getByText('Work')).toBeInTheDocument()
    expect(wholeTrail().queryByRole('link', { name: 'Work' })).not.toBeInTheDocument()
    expect(isCurrent(wholeTrail().getByText('Orders'))).toBe(true)
    // A narrow screen has room for the last two steps.
    expect(shortTrail().getByText('Work')).toBeInTheDocument()
    expect(isCurrent(shortTrail().getByText('Orders'))).toBe(true)
    expect(shortTrail().queryByText('Home')).not.toBeInTheDocument()
  })

  it('is Home alone on the page at /', async () => {
    renderShell({ path: '/' })

    expect(await screen.findByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
    expect(wholeTrail().getAllByRole('listitem')).toHaveLength(1)
    expect(isCurrent(wholeTrail().getByText('Home'))).toBe(true)
  })

  it('leads from a deeper page back through the pages it names, to its page of the menu', async () => {
    renderShell({ path: '/reports/r1/days/2026-10-09' })

    expect(isCurrent(await wholeTrail().findByText('9 Oct 2026'))).toBe(true)
    expect(wholeTrail().getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports')
    expect(wholeTrail().getByRole('link', { name: 'October report' })).toHaveAttribute('href', '/reports/r1')
    // On a narrow screen, the way back to the report stays.
    expect(shortTrail().getByRole('link', { name: 'October report' })).toHaveAttribute('href', '/reports/r1')
    expect(isCurrent(shortTrail().getByText('9 Oct 2026'))).toBe(true)
    expect(document.title).toBe('9 Oct 2026 · Test App')
  })

  it('forgets the name of a page left behind', async () => {
    const user = userEvent.setup()
    renderShell({ path: '/library/assets/blue-logo' })
    expect(isCurrent(await wholeTrail().findByText('Blue logo'))).toBe(true)
    expect(wholeTrail().getByRole('link', { name: 'Assets' })).toHaveAttribute('href', '/library/assets')

    await user.click(screen.getByRole('link', { name: 'To the orders' }))

    expect(isCurrent(await wholeTrail().findByText('Orders'))).toBe(true)
    expect(screen.queryByText('Blue logo')).not.toBeInTheDocument()
  })

  it('says of an address that is no page that there is none', async () => {
    renderShell({ path: '/orders/nothing' })

    expect(isCurrent(await wholeTrail().findByText('Page not found'))).toBe(true)
    expect(wholeTrail().getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/orders')
    expect(screen.getByRole('heading', { level: 1, name: 'There is no page here.' })).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'There is no page here.' })).getByText('/orders/nothing')).toBeInTheDocument()
    expect(document.title).toBe('Page not found · Test App')
    // The way out is a link too, and so is the page of the menu the address was under.
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    const suggestions = within(screen.getByRole('navigation', { name: 'Helpful links' }))
    expect(suggestions.getByRole('link', { name: /^Orders/ })).toHaveAttribute('href', '/orders')
  })

  it('suggests nothing for an address under no page of the menu', async () => {
    renderShell({ path: '/nowhere' })

    expect(await screen.findByRole('heading', { level: 1, name: 'There is no page here.' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Helpful links' })).not.toBeInTheDocument()
  })

  it('goes back a step in the history from a page that is none', async () => {
    const user = userEvent.setup()
    render(
      <IoitiProvider>
        <MemoryRouter initialEntries={['/orders', '/orders/nothing']} initialIndex={1}>
          <Routes>
            <Route element={<RouterRoot />}>
              <Route element={<RouterAppShell menu={MENU} />}>
                <Route path="orders" element={<h1>Orders</h1>} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </IoitiProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Previous page' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument()
  })
})

describe('the menu', () => {
  it('is made of links, each opening its page here, or in another tab', async () => {
    const user = userEvent.setup()
    renderShell({ path: '/' })
    const menu = within(await screen.findByRole('navigation', { name: 'Main' }))

    // An address each: what a right click offers to open in another tab.
    for (const entry of MENU.entries) expect(menu.getByRole('link', { name: entry.label })).toHaveAttribute('href', entry.path)
    expect(menu.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')

    // A click with Ctrl or ⌘ is the browser's, for another tab: this one stays where it is.
    await user.keyboard('{Control>}')
    await user.click(menu.getByRole('link', { name: 'Orders' }))
    await user.keyboard('{/Control}')
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()

    await user.click(menu.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(menu.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page')
  })
})

describe('the sidebar', () => {
  it('names the application at its top, with a line under the name', () => {
    renderShell()

    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.getByText('v1.2.0')).toBeInTheDocument()
  })

  it('carries the application\'s own action at its foot', async () => {
    const user = userEvent.setup()
    const onSignOut = vi.fn()
    renderShell({ onSignOut })

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(onSignOut).toHaveBeenCalledOnce()
  })
})

describe('scrolling', () => {
  it('opens another page at its top, and leaves a page where it is when only its query changes', async () => {
    const user = userEvent.setup()
    renderShell({ path: '/library/assets/blue-logo' })
    await screen.findByRole('heading', { name: 'Blue logo' })
    const main = screen.getByRole('main')

    main.scrollTop = 600
    await user.click(screen.getByRole('link', { name: 'The back' }))
    expect(main.scrollTop).toBe(600)

    await user.click(screen.getByRole('link', { name: 'To the orders' }))
    await screen.findByRole('heading', { name: 'Orders' })
    expect(main.scrollTop).toBe(0)
  })
})

describe('without a router', () => {
  it('draws the same shell, its links plain ones, for the address it is given', () => {
    render(
      <IoitiProvider appName="Test App">
        <AppShell menu={MENU} pathname="/library/assets/blue-logo">
          <PageHeader title="Blue logo" />
        </AppShell>
      </IoitiProvider>,
    )

    const menu = within(screen.getByRole('navigation', { name: 'Main' }))
    expect(menu.getByRole('link', { name: 'Assets' })).toHaveAttribute('aria-current', 'page')
    expect(wholeTrail().getByRole('link', { name: 'Assets' })).toHaveAttribute('href', '/library/assets')
    expect(isCurrent(wholeTrail().getByText('Blue logo'))).toBe(true)
  })
})
