import { render, screen, within } from '@testing-library/react'
import { IoitiProvider } from 'ioiti-ui'
import type { ErrorReporter } from 'ioiti-ui'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routes } from './router'

/** The application at an address: its routes on a router kept in memory, in the provider src/main.tsx gives them. */
function open(path: string, onError?: ErrorReporter) {
  render(
    <IoitiProvider appName="My App" onError={onError}>
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />
    </IoitiProvider>,
  )
}

/** The heading of the page shown, once it is there: in the shell's main, beside the sidebar's menu, under the top bar. */
async function pageHeading() {
  const heading = await within(screen.getByRole('main')).findByRole('heading', { level: 1 })
  // The shell around it: the sidebar's menu, and the top bar's trail of where the page is (jsdom, which reads no CSS,
  // has its whole form and its short one).
  expect(screen.getByRole('navigation', { name: 'Main' })).toBeTruthy()
  expect(screen.getAllByRole('navigation', { name: 'Breadcrumb' })).not.toHaveLength(0)
  return heading.textContent
}

describe('the pages, through the router', () => {
  it('draws the dashboard at /, in the shell', async () => {
    open('/')
    expect(await pageHeading()).toBe('Dashboard')
  })

  it('draws the items at /items, their code loaded as the page opens', async () => {
    open('/items')
    expect(await pageHeading()).toBe('Items')
  })

  it('says so at an address of no page', async () => {
    open('/nowhere')
    expect(await pageHeading()).toBe('There is no page here.')
  })
})

describe('a page that throws', () => {
  afterEach(() => {
    vi.doUnmock('./pages/ItemsPage')
    vi.restoreAllMocks()
  })

  it('shows what went wrong in its place, the shell kept, and reports it once', async () => {
    // The items page, made to throw as it draws.
    vi.doMock('./pages/ItemsPage', () => ({
      ItemsPage: () => {
        throw new Error('The items could not be drawn')
      },
    }))
    // React and the router say on the console what they caught: quiet here.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onError = vi.fn<ErrorReporter>()
    open('/items', onError)
    expect(await pageHeading()).toBe('Something went wrong')
    expect(onError).toHaveBeenCalledOnce()
  })
})
