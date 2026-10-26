import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { contrast, contrastPairs, parseColor, themeTokens, toHex } from './tokens.js'

// The package's stylesheets, from disk: the tests treat a stylesheet imported as an empty one.
const read = (name: string) => readFileSync(`src/styles/${name}`, 'utf8')
const SHEETS = [read('tokens.css'), read('theme.css'), read('design.css')]

/**
 * The text colours under 4.5:1 on a surface, as the design was taken (docs/provenance.md), kept for
 * it to stay the same. A change of the palette that makes one pass, or another fail, shows here.
 */
const KNOWN_UNDER = [{ theme: 'dark', text: '--text-subtle', surface: '--surface-hover', ratio: 4.44 }]

describe('the colours, read as the browser reads them', () => {
  it('are read in every form the stylesheets write them', () => {
    expect(toHex(parseColor('#fafafa')!)).toBe('#fafafa')
    expect(toHex(parseColor('#FFF')!)).toBe('#ffffff')
    expect(parseColor('rgba(10, 10, 10, 0.05)')).toMatchObject({ a: 0.05 })
    // Tailwind's zinc, as oklch and as hex.
    expect(toHex(parseColor('oklch(0.141 0.005 285.823)')!)).toBe('#09090b')
    expect(toHex(parseColor('oklch(0.92 0.004 286.32)')!)).toBe('#e4e4e7')
    expect(parseColor('oklch(1 0 0 / 10%)')).toMatchObject({ a: 0.1 })
    expect(parseColor('var(--border)')).toBeNull()
  })

  it('give WCAG\'s contrast: 21 for black on white, 1 for a colour on itself', () => {
    expect(contrast(parseColor('#000')!, parseColor('#fff')!)).toBeCloseTo(21, 5)
    expect(contrast(parseColor('#676772')!, parseColor('#676772')!)).toBeCloseTo(1, 5)
  })

  it('are the last set, in the order the stylesheets are imported', () => {
    // tokens.css sets the border of the dark theme to #29292C; design.css sets it again, and wins.
    expect(themeTokens(SHEETS, 'dark')['--border']).toBe('oklch(1 0 0 / 10%)')
    // The light page is one step off white, and its secondary text darker than EasyUI's.
    expect(themeTokens(SHEETS, 'light')['--background']).toBe('#fafafa')
    expect(themeTokens(SHEETS, 'light')['--muted-foreground']).toBe('#676772')
    expect(themeTokens(SHEETS, 'dark')['--text-muted']).toBe('#9a9aa3')
  })
})

describe('the contrast of text', () => {
  for (const theme of ['light', 'dark'] as const) {
    it(`is 4.5:1 at least for every text colour on every surface of the ${theme} theme`, () => {
      const pairs = contrastPairs(themeTokens(SHEETS, theme))
      expect(pairs.length).toBeGreaterThanOrEqual(50)
      const under = pairs.filter((pair) => pair.ratio < 4.5)
      const known = KNOWN_UNDER.filter((pair) => pair.theme === theme)
      expect(under.map(({ text, surface }) => ({ text, surface }))).toEqual(known.map(({ text, surface }) => ({ text, surface })))
      for (const pair of known) {
        expect(under.find((found) => found.text === pair.text && found.surface === pair.surface)?.ratio).toBeCloseTo(pair.ratio, 2)
      }
    })
  }
})
