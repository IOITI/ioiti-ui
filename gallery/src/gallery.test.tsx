import { cleanup, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FORMER_PARTS } from './catalogue/legacy'
import { A_PAGE, BASE, describePages, heading, renderAt } from './gallery-pages'

// The first of the four shares of the gallery's pages (gallery-pages.tsx); the others in gallery.2-4.test.tsx.
describePages(0, 4)

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

describe('a component’s former address', () => {
  it('leads to its page under the name of its role, at the same example', async () => {
    const router = renderAt('/components/overlays/settle-modal#form')
    await screen.findAllByRole('heading', { level: 1, name: 'Dialog' }, { timeout: 10_000 })
    expect(router.state.location.pathname).toBe('/ioiti-ui/components/overlays/dialog')
    expect(router.state.location.hash).toBe('#form')
    expect(screen.queryByText('Formerly SettleModal')).not.toBeNull()
  }, A_PAGE)
})
