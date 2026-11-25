import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { blocks, guidelinesOf, inline, leaves, plain, summaryOf } from './markdown-blocks'

const CHANGELOG = readFileSync(join(import.meta.dirname, '..', '..', '..', 'CHANGELOG.md'), 'utf8')

describe('the gallery’s Markdown', () => {
  it('reads a heading at its level', () => {
    expect(blocks('# Changelog\n\n## [Unreleased]\n\n### Added\n\n#### More')).toEqual([
      { type: 'title', level: 1, text: 'Changelog' },
      { type: 'title', level: 2, text: '[Unreleased]' },
      { type: 'title', level: 3, text: 'Added' },
      { type: 'title', level: 4, text: 'More' },
    ])
  })

  it('reads a list inside a list, a line indented going on with its item', () => {
    const markdown = ['- **`SpotlightSearch`**:', '  - The focus stays in it: Tab goes', '    round its controls.', '    - Deeper.', '  - Its keys are its own.', '- `KpiTile`.'].join('\n')
    expect(blocks(markdown)).toEqual([
      {
        type: 'list',
        items: [
          {
            text: '**`SpotlightSearch`**:',
            items: [{ text: 'The focus stays in it: Tab goes round its controls.', items: [{ text: 'Deeper.' }] }, { text: 'Its keys are its own.' }],
          },
          { text: '`KpiTile`.' },
        ],
      },
    ])
  })

  it('reads a table, its columns aligned as its second line says', () => {
    const markdown = ['Which one:', '', '| Component | When | Size |', '| :-- | :-: | --: |', '| `Dialog` | A choice to make | 3 |', '| `Sheet` | A form \\| a record |'].join('\n')
    expect(blocks(markdown)).toEqual([
      { type: 'paragraph', text: 'Which one:' },
      {
        type: 'table',
        head: ['Component', 'When', 'Size'],
        align: ['left', 'center', 'right'],
        rows: [
          ['`Dialog`', 'A choice to make', '3'],
          ['`Sheet`', 'A form | a record', ''],
        ],
      },
    ])
    // A line of pipes with no line of columns under it is a paragraph.
    expect(blocks('| not a table |')).toEqual([{ type: 'paragraph', text: '| not a table |' }])
  })

  it('reads a line’s code, strong and emphasised words and links, one inside another', () => {
    expect(inline('**`SpotlightSearch` keeps the focus**, *Back to the top*: see [the `Dialog` page](/components/overlays/dialog).')).toEqual([
      {
        type: 'strong',
        text: 'SpotlightSearch keeps the focus',
        parts: [
          { type: 'code', text: 'SpotlightSearch' },
          { type: 'text', text: ' keeps the focus' },
        ],
      },
      { type: 'text', text: ', ' },
      { type: 'emphasis', text: 'Back to the top', parts: [{ type: 'text', text: 'Back to the top' }] },
      { type: 'text', text: ': see ' },
      {
        type: 'link',
        text: 'the Dialog page',
        href: '/components/overlays/dialog',
        parts: [
          { type: 'text', text: 'the ' },
          { type: 'code', text: 'Dialog' },
          { type: 'text', text: ' page' },
        ],
      },
      { type: 'text', text: '.' },
    ])
    // What code holds is code; a star between spaces, or without its pair, is a star.
    expect(inline('`[x](y)` and `**`, 10 * 1024, image/*')).toEqual([
      { type: 'code', text: '[x](y)' },
      { type: 'text', text: ' and ' },
      { type: 'code', text: '**' },
      { type: 'text', text: ', 10 * 1024, image/*' },
    ])
    expect(plain('[0.30.0](https://github.com/IOITI/ioiti-ui/releases/tag/v0.30.0) - **2026-11-24**')).toBe('0.30.0 - 2026-11-24')
  })

  it('makes `[words]` a link where a line of the document gives its address, and draws no such line', () => {
    const markdown = [
      'What is not released yet is under [Unreleased]; `[0.30.0]` is code, [0.29.0] has no address.',
      '',
      '## [Unreleased]',
      '',
      '## [0.30.0] - 2026-11-24',
      '',
      '```md',
      '[0.30.0]: https://example.com/in-code',
      '```',
      '',
      '[unreleased]: https://github.com/IOITI/ioiti-ui/compare/v0.30.0...main',
      '[0.30.0]: https://github.com/IOITI/ioiti-ui/releases/tag/v0.30.0',
    ].join('\n')
    expect(blocks(markdown)).toEqual([
      {
        type: 'paragraph',
        text: 'What is not released yet is under [Unreleased](https://github.com/IOITI/ioiti-ui/compare/v0.30.0...main); `[0.30.0]` is code, [0.29.0] has no address.',
      },
      { type: 'title', level: 2, text: '[Unreleased](https://github.com/IOITI/ioiti-ui/compare/v0.30.0...main)' },
      { type: 'title', level: 2, text: '[0.30.0](https://github.com/IOITI/ioiti-ui/releases/tag/v0.30.0) - 2026-11-24' },
      { type: 'code', language: 'md', code: '[0.30.0]: https://example.com/in-code' },
    ])
  })

  it('makes every version of the CHANGELOG a heading that links to it', () => {
    const versions = blocks(CHANGELOG).filter((block) => block.type === 'title' && block.level === 2)
    expect(versions.length).toBeGreaterThan(40)
    for (const version of versions) {
      if (version.type !== 'title') continue
      const [link] = inline(version.text)
      expect(link, version.text).toMatchObject({ type: 'link', href: expect.stringMatching(/^https:\/\/github\.com\/IOITI\/ioiti-ui\//) })
    }
    expect(JSON.stringify(blocks(CHANGELOG)), 'a line of the foot drawn').not.toMatch(/\]: https:/)
  })

  it('keeps a README’s headings from ## on in its guidelines, not its title, summary or "You provide"', () => {
    const readme = [
      '# LineChart',
      '',
      'Values over time.',
      '',
      '**You provide** `data`.',
      '',
      '- A gap is a gap.',
      '',
      '## FanChart',
      '',
      'Ranges that widen.',
      '',
      '**You provide** `bands`.',
      '',
      '## Accessibility',
      '',
      '| Key | Does |',
      '| --- | --- |',
      '| Arrows | Read a moment |',
    ].join('\n')
    expect(summaryOf(readme)).toBe('Values over time.')
    expect(guidelinesOf(readme)).toEqual([
      { type: 'list', items: [{ text: 'A gap is a gap.' }] },
      { type: 'title', level: 2, text: 'FanChart' },
      { type: 'paragraph', text: 'Ranges that widen.' },
      { type: 'title', level: 2, text: 'Accessibility' },
      { type: 'table', head: ['Key', 'Does'], align: [null, null], rows: [['Arrows', 'Read a moment']] },
    ])
  })

  it('tells a link that leaves the gallery from one that stays in it', () => {
    expect(leaves('https://github.com/IOITI/ioiti-ui')).toBe(true)
    expect(leaves('mailto:design@example.com')).toBe(true)
    expect(leaves('#v0.30.0')).toBe(false)
    expect(leaves('/foundations/conventions')).toBe(false)
  })
})
