// What every page of the gallery is held to, its pages shared among four test files that run side by side
// (gallery.test.tsx and gallery.<2-4>.test.tsx): drawn through its router as GitHub Pages serves it, its heading, its
// examples and its props, its links under /ioiti-ui/, and nothing axe finds in it (test/a11y.ts).
import { render, screen } from '@testing-library/react'
import { IoitiProvider } from 'ioiti-ui'
import type { MessagesOverride } from 'ioiti-ui'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../test/a11y'
import { routes } from './router'
import { PAGES } from './routes'

/** The gallery as GitHub Pages publishes it: under /ioiti-ui/. */
export const BASE = '/ioiti-ui/'

/** A page loads its category's examples first: the first of a category waits for them to be transformed. */
export const A_PAGE = 20_000

/** A page of the gallery drawn through its router, in English or in the language given (`locale`, `messages`). */
export function renderAt(path: string, language: { locale?: string; messages?: MessagesOverride } = {}) {
  const router = createMemoryRouter(routes, { basename: BASE, initialEntries: [`${BASE}${path.slice(1)}`] })
  render(
    <IoitiProvider appName="ioiti-ui" locale={language.locale} messages={language.messages}>
      <RouterProvider router={router} />
    </IoitiProvider>,
  )
  return router
}

/** A page's heading, once its category's examples are loaded (a chunk of their own). */
export const heading = () => screen.findAllByRole('heading', { level: 1 }, { timeout: 10_000 })

/** The links of the page shown that leave the published gallery. */
function linksOutside(path: string): string[] {
  return [...document.querySelectorAll('a[href]')]
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => !/^(\/ioiti-ui\/|#|https?:|mailto:)/.test(href))
    .map((href) => `${path}: ${href}`)
}

/** The tests of the pages whose place in PAGES is `part`, counted in `parts`: one file's share. */
export function describePages(part: number, parts: number) {
  describe(`every page of the gallery (${part + 1} of ${parts})`, () => {
    for (const page of PAGES.filter((_, index) => index % parts === part)) {
      it(`draws ${page.label} (${page.path}), its links under /ioiti-ui/, nothing axe finds`, async () => {
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
        await expectAccessible(document.querySelector('main') ?? document.body)
      }, A_PAGE)
    }
  })
}
