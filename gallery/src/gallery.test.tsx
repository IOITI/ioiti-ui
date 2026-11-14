import { cleanup, render, screen } from '@testing-library/react'
import { IoitiProvider } from 'ioiti-ui'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { FORMER_PARTS } from './catalogue/legacy'
import { routes } from './router'
import { PAGES } from './routes'

/** The gallery as GitHub Pages publishes it: under /ioiti-ui/. */
const BASE = '/ioiti-ui/'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { basename: BASE, initialEntries: [`${BASE}${path.slice(1)}`] })
  render(
    <IoitiProvider appName="ioiti-ui">
      <RouterProvider router={router} />
    </IoitiProvider>,
  )
  return router
}

/** A page's heading, once its category's examples are loaded (a chunk of their own). */
const heading = () => screen.findAllByRole('heading', { level: 1 }, { timeout: 10_000 })

/** The links of the page shown that leave the published gallery. */
function linksOutside(path: string): string[] {
  return [...document.querySelectorAll('a[href]')]
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => !/^(\/ioiti-ui\/|#|https?:|mailto:)/.test(href))
    .map((href) => `${path}: ${href}`)
}

// A page loads its category's examples first: the first of a category waits for them to be transformed.
const A_PAGE = 20_000

describe('every page of the gallery', () => {
  for (const page of PAGES) {
    it(`draws ${page.label} (${page.path}), its links under /ioiti-ui/`, async () => {
      renderAt(page.path)
      expect(await heading()).not.toHaveLength(0)
      if (page.family) {
        for (const example of page.family.examples) {
          expect(document.querySelector(`[data-example="${example.id}"]`), `${page.path}#${example.id}`).not.toBeNull()
        }
        expect(document.getElementById('props')).not.toBeNull()
      }
      if (page.category && !page.family) {
        for (const family of page.category.families) expect(document.getElementById(family.slug), family.name).not.toBeNull()
      }
      expect(linksOutside(page.path), 'links that leave the published gallery').toEqual([])
    }, A_PAGE)
  }
})

describe('a link to a part of a former page', () => {
  it('leads to the page of the component it showed', async () => {
    for (const { from, to } of FORMER_PARTS.filter((_, index) => index % 9 === 0)) {
      const router = renderAt(from)
      await heading()
      // A part named as one of the components of the category at its former address stays: it is that one's panel.
      const [path, part] = from.split('#')
      const stays = to === `${path}/${part}`
      expect(router.state.location.pathname, from).toBe(`${BASE}${(stays ? path : to).slice(1)}`)
      cleanup()
    }
  }, A_PAGE)

  it('leads from a page that is none now to the category it became', async () => {
    const router = renderAt('/components/data#kpi')
    await heading()
    expect(router.state.location.pathname).toBe('/ioiti-ui/components/figures/kpi-tile')
    cleanup()
    renderAt('/components/data')
    await screen.findAllByRole('heading', { level: 1, name: 'Tables and lists' }, { timeout: 10_000 })
  }, A_PAGE)
})
