import { render, screen, within } from '@testing-library/react'
import { IoitiProvider } from 'ioiti-ui'
import { describe, expect, it } from 'vitest'

import { expectAccessible } from '../../../test/a11y'
import { Guidelines, MarkdownBlocks } from './Markdown'
import { blocks } from './markdown-blocks'

const DOC = [
  '## Which one?',
  '',
  'Read [the conventions](/foundations/conventions), [its props](#props) or [the releases](https://github.com/IOITI/ioiti-ui/releases).',
  '',
  '| Component | When | Layers |',
  '| --- | --- | --: |',
  '| `Dialog` | A choice to make, **now** | 1 |',
  '| `Sheet` | A record beside the page | 2 |',
  '',
  '- A dialog:',
  '  - keeps the focus.',
].join('\n')

describe('the gallery’s Markdown, drawn', () => {
  it('draws a table with the package’s Table, named by its heading, figures to the right', async () => {
    render(
      <IoitiProvider appName="ioiti-ui">
        <main>
          <MarkdownBlocks blocks={blocks(DOC)} />
        </main>
      </IoitiProvider>,
    )
    const table = within(screen.getByRole('table', { name: 'Which one?' }))
    expect(table.getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual(['Component', 'When', 'Layers'])
    const dialog = within(table.getAllByRole('row')[1])
    expect(dialog.getByText('Dialog').tagName).toBe('CODE')
    expect(dialog.getByText('now').tagName).toBe('STRONG')
    expect(dialog.getAllByRole('cell')[2].classList.contains('text-right')).toBe(true)
    // A list inside a list.
    expect(screen.getByText('keeps the focus.').parentElement?.closest('li')?.textContent).toBe('A dialog:keeps the focus.')
    await expectAccessible(document.querySelector('main')!)
  })

  it('keeps a link to a page or a part of it inside the gallery, and marks one that leaves it', () => {
    render(<MarkdownBlocks blocks={blocks(DOC)} />)
    const page = screen.getByRole('link', { name: 'the conventions' })
    expect(page.getAttribute('href')).toBe('/foundations/conventions')
    expect(page.querySelector('svg')).toBeNull()
    expect(screen.getByRole('link', { name: 'its props' }).getAttribute('href')).toBe('#props')
    const leaving = screen.getByRole('link', { name: 'the releases' })
    expect(leaving.getAttribute('href')).toBe('https://github.com/IOITI/ioiti-ui/releases')
    expect(leaving.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('draws a document’s ## as an h2, a README’s as an h3 under its panel’s h2', () => {
    const { unmount } = render(<MarkdownBlocks blocks={blocks(DOC)} />)
    expect(screen.getByRole('heading', { name: 'Which one?' }).tagName).toBe('H2')
    unmount()
    render(<Guidelines markdown={`# Dialog\n\nA dialog.\n\n${DOC}`} />)
    expect(screen.getByRole('heading', { name: 'Which one?' }).tagName).toBe('H3')
    expect(screen.queryByRole('heading', { name: 'Dialog' })).toBeNull()
  })
})
