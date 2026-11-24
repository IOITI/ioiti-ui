import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, data, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { expectAccessible } from '../../test/a11y.js'
import { IoitiProvider } from '../components/IoitiProvider.js'
import { MENU } from '../test/menu.js'
import { RouterAppShell } from './RouterAppShell.js'
import { RouterErrorPage } from './RouterErrorPage.js'
import { RouterRoot } from './RouterRoot.js'

let calls = 0

function Broken(): never {
  throw new Error('The page drew nothing')
}

/** An application as the starter template routes one: the shell, and every page under one route of the router's errors. */
function app(path: string) {
  const onError = vi.fn()
  const router = createMemoryRouter(
    [
      {
        element: <RouterRoot />,
        errorElement: <RouterErrorPage />,
        children: [
          { path: 'outside', element: <Broken /> },
          {
            element: <RouterAppShell menu={MENU} />,
            children: [
              {
                errorElement: <RouterErrorPage signIn={{ href: '/login' }} />,
                children: [
                  { path: 'orders', element: <h1>Orders</h1> },
                  { path: 'broken', element: <Broken /> },
                  {
                    path: 'missing',
                    loader: () => {
                      throw data(null, { status: 404 })
                    },
                    element: <h1>Never</h1>,
                  },
                  {
                    path: 'signed-out',
                    loader: () => {
                      throw data(null, { status: 401 })
                    },
                    element: <h1>Never</h1>,
                  },
                  {
                    path: 'forbidden',
                    loader: () => {
                      throw data(null, { status: 403 })
                    },
                    element: <h1>Never</h1>,
                  },
                  {
                    path: 'flaky',
                    loader: () => {
                      calls += 1
                      if (calls === 1) throw new Error('The server answered 500')
                      return null
                    },
                    element: <h1>Flaky, loaded</h1>,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  render(
    <IoitiProvider appName="Test App" onError={onError}>
      <RouterProvider router={router} />
    </IoitiProvider>,
  )
  return { router, onError }
}

/** The shell around the page: its menu and its top bar. */
const shellKept = () => {
  expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
  expect(screen.getByRole('banner')).toBeInTheDocument()
}

beforeEach(() => {
  calls = 0
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('RouterErrorPage', () => {
  it('shows a page that threw as it drew in the shell, and tells the application once', async () => {
    const { onError } = app('/broken')
    expect(await screen.findByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument()
    shellKept()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][1]).toEqual({ source: 'route' })
    await expectAccessible(document.body)
  })

  it('shows a 404 a loader threw as the page not found, in the shell', async () => {
    app('/missing')
    expect(await screen.findByRole('heading', { level: 1, name: 'There is no page here.' })).toBeInTheDocument()
    shellKept()
  })

  it('says a page the person may not see as such', async () => {
    app('/forbidden')
    expect(await screen.findByRole('heading', { level: 1, name: 'This page is not yours to see' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull()
  })

  it('asks a person whose session ended to sign in again', async () => {
    app('/signed-out')
    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in to see this page' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
  })

  it('runs the route again on Try again: a loader that failed once may load', async () => {
    const user = userEvent.setup()
    app('/flaky')
    await user.click(await screen.findByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Flaky, loaded' })).toBeInTheDocument()
  })

  it('stands alone on the root, for an error outside the shell', async () => {
    app('/outside')
    expect(await screen.findByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).toBeNull()
  })
})
