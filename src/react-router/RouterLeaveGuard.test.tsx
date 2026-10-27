import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { createMemoryRouter, Link, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { RouterLeaveGuard } from './RouterLeaveGuard.js'

function Address() {
  const location = useLocation()
  return <output aria-label="address">{location.pathname + location.search}</output>
}

function Settings() {
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
      <RouterLeaveGuard when={dirty} />
    </>
  )
}

function renderRouter() {
  const router = createMemoryRouter(
    [
      { path: '/settings', element: <Settings /> },
      { path: '/orders', element: <h1>Orders</h1> },
    ],
    { initialEntries: ['/settings'] },
  )
  render(<RouterProvider router={router} />)
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

  it('takes a change of the query for no leaving', async () => {
    const user = userEvent.setup()
    renderRouter()
    await user.click(screen.getByRole('button', { name: 'Change' }))
    await user.click(screen.getByRole('link', { name: 'Mail' }))
    expect(screen.getByLabelText('address')).toHaveTextContent('/settings?tab=mail')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
