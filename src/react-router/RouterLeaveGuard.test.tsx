import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { createMemoryRouter, Link, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { IoitiProvider } from '../components/IoitiProvider.js'
import type { MessagesOverride } from '../components/locale-context.js'
import { fr } from '../locales/fr.js'
import { RouterLeaveGuard } from './RouterLeaveGuard.js'

function Address() {
  const location = useLocation()
  return <output aria-label="address">{location.pathname + location.search}</output>
}

function Settings({ within, allowed }: { within?: string; allowed?: (pathname: string) => boolean }) {
  const [dirty, setDirty] = useState(false)
  return (
    <>
      <Address />
      <button type="button" onClick={() => setDirty(true)}>
        Change
      </button>
      <button type="button" onClick={() => setDirty(false)}>
        Save
      </button>
      <Link to="/orders">Orders</Link>
      <Link to="?tab=mail">Mail</Link>
      <Link to="/settings/billing">Billing</Link>
      <Link to="/sign-in">Sign in</Link>
      <RouterLeaveGuard when={dirty} within={within} allowed={allowed} />
    </>
  )
}

function renderRouter(
  guard: { within?: string; allowed?: (pathname: string) => boolean } = {},
  history = ['/settings'],
  language: { locale?: string; messages?: MessagesOverride } = {},
) {
  const router = createMemoryRouter(
    [
      // One route for the page and its views: the page and its draft stay mounted from one view to another.
      { path: '/settings/*', element: <Settings {...guard} /> },
      { path: '/orders', element: <h1>Orders</h1> },
      { path: '/sign-in', element: <h1>Sign in</h1> },
    ],
    { initialEntries: history, initialIndex: history.length - 1 },
  )
  const page = <RouterProvider router={router} />
  // A language given, in a provider of it.
  render(
    language.locale || language.messages ? (
      <IoitiProvider locale={language.locale} messages={language.messages}>
        {page}
      </IoitiProvider>
    ) : (
      page
    ),
  )
  return router
}

describe('RouterLeaveGuard', () => {
  it('lets the page go while nothing is to lose', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it('asks before another page, and stays', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Orders' }))

    const dialog = await screen.findByRole('dialog', { name: 'Leave without saving?' })
    expect(dialog).toHaveAccessibleDescription('The changes on this page are not saved: leaving it loses them.')
    await user.click(screen.getByRole('button', { name: 'Stay' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByLabelText('address')).toHaveTextContent('/settings')
  })

  it('asks before another page, and leaves', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Orders' }))
    await user.click(await screen.findByRole('button', { name: 'Leave' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })

  it("asks before the browser's Back, and goes back once told to leave", async () => {
    const user = userEvent.setup()
    const router = renderRouter({}, ['/orders', '/settings'])
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await act(() => router.navigate(-1))
    await user.click(await screen.findByRole('button', { name: 'Leave' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('takes a change of the query for no leaving', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Mail' }))
    expect(screen.getByLabelText('address')).toHaveTextContent('/settings?tab=mail')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks before another view of the page unless told the changes are kept there', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Billing' }))
    expect(await screen.findByRole('dialog', { name: 'Leave without saving?' })).toBeInTheDocument()
  })

  it("takes the page's own views for no leaving, and still asks before another page", async () => {
    const user = userEvent.setup()
    renderRouter({ within: '/settings' })
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Billing' }))
    expect(screen.getByLabelText('address')).toHaveTextContent('/settings/billing')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByRole('dialog', { name: 'Leave without saving?' })).toBeInTheDocument()
  })

  it('lets the page go where it is allowed to, without asking', async () => {
    const user = userEvent.setup()
    renderRouter({ allowed: (pathname) => pathname === '/sign-in' })
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it("asks the browser's own question on a reload or a closed tab, only while there is something to lose", async () => {
    const user = userEvent.setup()
    renderRouter()
    const closing = () => {
      const event = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(event)
      return event.defaultPrevented
    }
    expect(closing()).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Change' }))
    expect(closing()).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(closing()).toBe(false)
  })
})

describe('RouterLeaveGuard in French', () => {
  /** French's no-break spaces (before a colon, a question mark) read as spaces. */
  const spaced = (text: string) => text.replace(/\s/g, ' ')

  it('asks in the provider\'s words, and stays', async () => {
    const user = userEvent.setup()
    renderRouter({}, ['/settings'], { locale: 'fr-FR', messages: fr })
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Orders' }))

    const dialog = await screen.findByRole('dialog', { name: (name) => spaced(name) === 'Quitter sans enregistrer ?' })
    expect(spaced(dialog.textContent ?? '')).toContain('Les modifications de cette page ne sont pas enregistrées : elles seront perdues si vous la quittez.')
    expect(screen.getByRole('button', { name: 'Quitter' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Rester' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByLabelText('address')).toHaveTextContent('/settings')
  })

  it("takes an application's own words over the language's", async () => {
    const user = userEvent.setup()
    renderRouter({}, ['/settings'], { messages: { router: { leaveTitle: 'Discard your changes?', leave: 'Discard' } } })
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Orders' }))
    expect(await screen.findByRole('dialog', { name: 'Discard your changes?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(await screen.findByRole('heading', { name: 'Orders' })).toBeInTheDocument()
  })
})
