import { cleanup, render, screen } from '@testing-library/react'
import * as core from 'ioiti-ui'
import { IoitiProvider } from 'ioiti-ui'
import * as adapter from 'ioiti-ui/react-router'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { routes } from './router'
import { PAGES } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <IoitiProvider appName="ioiti-ui">
      <RouterProvider router={router} />
    </IoitiProvider>,
  )
}

/** A component: a name in PascalCase (not a CONSTANT), and something React can draw. */
function components(module: Record<string, unknown>): string[] {
  return Object.entries(module)
    .filter(([name]) => /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name))
    .filter(([, value]) => typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value))
    .map(([name]) => name)
}

/** What the page shown says it demonstrates (its demos' import lines). */
function shown(): string[] {
  return [...document.querySelectorAll('[data-names]')].flatMap((element) => (element.getAttribute('data-names') ?? '').split(' '))
}

describe('the gallery', () => {
  for (const page of PAGES) {
    it(`draws ${page.label} (${page.path}) without an error`, async () => {
      renderAt(page.path)
      expect(await screen.findAllByRole('heading', { level: 1 })).not.toHaveLength(0)
    })
  }

  it('shows every component of the package somewhere', async () => {
    const seen = new Set<string>()
    for (const page of PAGES) {
      renderAt(page.path)
      await screen.findAllByRole('heading', { level: 1 })
      for (const name of shown()) seen.add(name)
      cleanup()
    }
    const missing = [...components(core), ...components(adapter)].filter((name) => !seen.has(name))
    expect(missing, 'components with no demo in the gallery').toEqual([])
  })
})
