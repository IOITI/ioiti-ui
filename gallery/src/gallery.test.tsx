import { cleanup, render, screen } from '@testing-library/react'
import * as core from 'ioiti-ui'
import { IoitiProvider } from 'ioiti-ui'
import * as adapter from 'ioiti-ui/react-router'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { routes } from './router'
import { PAGES } from './routes'

function renderAt(path: string, basename = '/') {
  const router = createMemoryRouter(routes, { basename, initialEntries: [`${basename}${path.slice(1)}`] })
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

  it('keeps every link under the path it is published at (/ioiti-ui/ on GitHub Pages)', async () => {
    const outside: string[] = []
    for (const page of PAGES) {
      renderAt(page.path, '/ioiti-ui/')
      await screen.findAllByRole('heading', { level: 1 })
      for (const link of document.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href') ?? ''
        if (!/^(\/ioiti-ui\/|#|https?:|mailto:)/.test(href)) outside.push(`${page.path}: ${href}`)
      }
      cleanup()
    }
    expect(outside, 'links that leave the published gallery').toEqual([])
  })
})
