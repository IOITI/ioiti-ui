import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { RouterRoot } from '../react-router/RouterRoot.js'
import { PeekLink } from './PeekLink.js'

function Address() {
  return <p aria-label="address">{useLocation().pathname}</p>
}

/** A link previewed, in an application on React Router (RouterRoot gives it the router's links). */
function renderLink() {
  const router = createMemoryRouter(
    [
      {
        element: <RouterRoot />,
        children: [
          {
            path: '/',
            element: (
              <>
                <PeekLink to="/invoices/2026-0042" content={() => <p>Due on 30 Oct</p>}>
                  Invoice 2026-0042
                </PeekLink>
                <Address />
              </>
            ),
          },
          { path: '/invoices/:id', element: <Address /> },
        ],
      },
    ],
    { initialEntries: ['/'] },
  )
  render(<RouterProvider router={router} />)
}

describe('a link previewed', () => {
  it('shows what it leads to on keyboard focus, described by it', async () => {
    const user = userEvent.setup()
    renderLink()

    await user.tab()
    const link = screen.getByRole('link', { name: 'Invoice 2026-0042' })
    expect(link).toHaveFocus()
    expect(await screen.findByText('Due on 30 Oct')).toBeInTheDocument()
    expect(link).toHaveAttribute('aria-describedby')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Due on 30 Oct')).not.toBeInTheDocument())
  })

  it('opens on a first tap instead of leaving, and its card leads there', async () => {
    renderLink()
    const link = screen.getByRole('link', { name: 'Invoice 2026-0042' })

    fireEvent.pointerDown(link, { pointerType: 'touch' })
    fireEvent.click(link)

    expect(await screen.findByText('Due on 30 Oct')).toBeInTheDocument()
    expect(screen.getByLabelText('address')).toHaveTextContent(/^\/$/)
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/invoices/2026-0042')
  })

  it('is followed by a click, through the router', async () => {
    const user = userEvent.setup()
    renderLink()

    await user.click(screen.getByRole('link', { name: 'Invoice 2026-0042' }))

    expect(screen.getByLabelText('address')).toHaveTextContent('/invoices/2026-0042')
  })
})
