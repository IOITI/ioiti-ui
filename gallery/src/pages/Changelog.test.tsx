import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../../test/a11y'
import { A_PAGE, renderAt } from '../gallery-pages'

describe('the Changelog page', () => {
  it('draws the CHANGELOG: a panel for each version, its heading a link to its release, its sections under it', async () => {
    renderAt('/changelog')
    await screen.findByRole('heading', { level: 1, name: 'Changelog' })
    const main = document.querySelector('main')!
    const page = within(main)

    // Each version an h2, whose link leaves for its release (an arrow says so), its day under it.
    const versions = page.getAllByRole('heading', { level: 2 })
    expect(within(versions[0]).getByRole('link', { name: 'Unreleased' }).getAttribute('href')).toMatch(/^https:\/\/github\.com\/IOITI\/ioiti-ui\/compare\//)
    const first = versions.find((heading) => heading.textContent === '0.24.0')!
    const release = within(first).getByRole('link', { name: '0.24.0' })
    expect(release.getAttribute('href')).toBe('https://github.com/IOITI/ioiti-ui/releases/tag/v0.24.0')
    expect(release.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    const panel = first.closest('section')!
    expect(panel.id).toBe('v0.24.0')
    expect(within(panel).queryByText('2026-11-24')).not.toBeNull()

    // The versions written in sections, from 0.24.0; the notes before them, one list each, are on GitHub: none of them
    // here, nor the name of the application the design was taken from, which they say.
    expect(versions.find((heading) => heading.textContent === '0.23.2')).toBeUndefined()
    expect(page.getByRole('link', { name: /CHANGELOG\.md, on GitHub/ }).getAttribute('href')).toBe('https://github.com/IOITI/ioiti-ui/blob/main/CHANGELOG.md')
    expect(main.textContent).not.toMatch(/\b(wata|saxo)\b/i)

    // A version's sections are its h3s: Added, Changed…
    const sections = within(document.getElementById('v0.30.0')!).getAllByRole('heading', { level: 3 })
    expect(sections.map((section) => section.textContent)).toContain('Added')

    // The list of versions leads to each one's panel, in the page.
    const list = within(page.getByRole('navigation', { name: 'Versions' }))
    expect(list.getByRole('link', { name: '0.24.0' }).getAttribute('href')).toBe('#v0.24.0')
    expect(list.getByRole('link', { name: 'Unreleased' }).getAttribute('href')).toBe('#unreleased')
    expect(list.getAllByRole('link')).toHaveLength(versions.length)

    // The lines of its foot make its links, and are no words of the page.
    expect(main.textContent).not.toMatch(/\]: https:/)
    await expectAccessible(main)
  }, A_PAGE)
})
