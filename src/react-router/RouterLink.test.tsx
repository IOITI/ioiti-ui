import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { CheckList } from '../components/CheckList.js'
import type { Check } from '../lib/checks.js'
import { RouterRoot } from './RouterRoot.js'

function Address() {
  const location = useLocation()
  return <p aria-label="address">{location.pathname + location.search + location.hash}</p>
}

const CHECKS: Check[] = [
  { id: 'sample', label: 'Enough trades', state: 'pass', detail: '42 trades' },
  { id: 'edge', label: 'An edge', state: 'fail', detail: 't = 1.2' },
]

/** Checks on a page of an application on React Router, one leading to a part of the page, one to another page. */
function renderChecks(at: string) {
  const router = createMemoryRouter(
    [
      {
        element: <RouterRoot />,
        children: [
          {
            path: '/runs/:id',
            element: (
              <>
                <CheckList checks={CHECKS} label="Checks" hrefOf={(check) => (check.id === 'edge' ? '#edge' : '/runs')} />
                <Address />
              </>
            ),
          },
          { path: '/runs', element: <Address /> },
        ],
      },
    ],
    { initialEntries: [at] },
  )
  render(<RouterProvider router={router} />)
}

describe("the router's link", () => {
  it('leads to another page through the router', async () => {
    const user = userEvent.setup()
    renderChecks('/runs/42?tab=days')

    expect(screen.getByRole('link', { name: 'Enough trades' })).toHaveAttribute('href', '/runs')
    await user.click(screen.getByRole('link', { name: 'Enough trades' }))

    expect(screen.getByLabelText('address')).toHaveTextContent(/^\/runs$/)
  })

  it('leaves a part of the page shown to the browser: no route, the query kept', () => {
    renderChecks('/runs/42?tab=days')

    // An address of its own, which the browser follows in place (jsdom does not scroll): the router is not asked.
    expect(screen.getByRole('link', { name: 'An edge' })).toHaveAttribute('href', '#edge')
    expect(screen.getByLabelText('address')).toHaveTextContent('/runs/42?tab=days')
  })
})
