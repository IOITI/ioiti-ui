import { readFileSync } from 'node:fs'

import { ACCENTS, MATERIALS } from 'ioiti-ui'
import { describe, expect, it } from 'vitest'

import { colourOf, contrast, contrastPairs, inside, lookPairs, lookSelectors, lookTokens, parseColor, themeTokens, toHex, tokensOf, valueOf } from './tokens.js'
import type { Look } from './tokens.js'

// The package's stylesheets, from disk: the tests treat a stylesheet imported as an empty one.
const read = (name: string) => readFileSync(`src/styles/${name}`, 'utf8')
const SHEETS = [read('tokens.css'), read('theme.css'), read('accents.css'), read('glass.css'), read('design.css')]

/**
 * The text colours under 4.5:1 on a surface, as the design was taken (docs/provenance.md), kept for
 * it to stay the same. A change of the palette that makes one pass, or another fail, shows here.
 */
const KNOWN_UNDER = [{ theme: 'dark', text: '--text-subtle', surface: '--surface-hover', ratio: 4.44 }]

/** The same, for every look: the design's own pairs where a look leaves them as they were. */
const KNOWN_UNDER_IN_LOOKS: (Partial<Look> & { text: string; surface: string; ratio: number })[] = [
  { theme: 'dark', material: 'flat', text: '--text-subtle', surface: '--surface-hover', ratio: 4.44 },
]

const LOOKS: Look[] = (['light', 'dark'] as const).flatMap((theme) =>
  ACCENTS.flatMap((accent) => MATERIALS.map((material) => ({ theme, accent, material }))),
)
const named = ({ theme, accent, material }: Look) => `${theme}, ${accent}, ${material}`

describe('the colours, read as the browser reads them', () => {
  it('are read in every form the stylesheets write them', () => {
    expect(toHex(parseColor('#fafafa')!)).toBe('#fafafa')
    expect(toHex(parseColor('#FFF')!)).toBe('#ffffff')
    expect(parseColor('rgba(10, 10, 10, 0.05)')).toMatchObject({ a: 0.05 })
    expect(parseColor('rgb(124 58 237 / 0.12)')).toMatchObject({ a: 0.12 })
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

  it('are read from the top level only: what an at-rule holds applies under its condition', () => {
    const css = ':root { --a: #000; } @media (min-width: 1px) { :root { --a: #fff; } } @custom-variant x (&:is(.x *));\n.x { --b: #111; }'
    expect(tokensOf(css, ':root')).toEqual({ '--a': '#000' })
    expect(tokensOf(css, '.x')).toEqual({ '--b': '#111' })
    expect(tokensOf(inside(css, '@media'), ':root')).toEqual({ '--a': '#fff' })
  })

  it('follow a var() to its token, or to its fallback where the token is unset', () => {
    const tokens = { '--brand': '#7c3aed', '--ring': 'var(--brand)', '--glow': 'var(--brand-glow, var(--ring))', '--wash': 'var(--unset, rgb(1 2 3 / 0.5))' }
    expect(valueOf(tokens, '--ring')).toBe('#7c3aed')
    expect(valueOf(tokens, '--glow')).toBe('#7c3aed')
    expect(colourOf(tokens, '--wash')).toMatchObject({ a: 0.5 })
    expect(valueOf(tokens, '--nothing')).toBeUndefined()
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

describe('every look: a theme, an accent, a material', () => {
  it('is 16 of them, and neutral and flat are the design as it was', () => {
    expect(LOOKS).toHaveLength(16)
    for (const theme of ['light', 'dark'] as const) {
      expect(lookTokens(SHEETS, { theme, accent: 'neutral', material: 'flat' })).toEqual(themeTokens(SHEETS, theme))
    }
  })

  for (const look of LOOKS) {
    it(`holds its text at 4.5:1 and its marks at 3:1 on every surface: ${named(look)}`, () => {
      const pairs = lookPairs(lookTokens(SHEETS, look), look)
      // Every text colour on every surface was read: none is lost to a format the reader does not know.
      expect(pairs.filter((pair) => pair.minimum === 4.5).length).toBeGreaterThanOrEqual(50)
      const under = pairs.filter((pair) => pair.ratio < pair.minimum)
      const known = KNOWN_UNDER_IN_LOOKS.filter((pair) => (['theme', 'accent', 'material'] as const).every((key) => pair[key] === undefined || pair[key] === look[key]))
      expect(under.map(({ text, surface, ratio }) => `${text} on ${surface}: ${ratio.toFixed(2)}`)).toEqual(
        known.map(({ text, surface, ratio }) => `${text} on ${surface}: ${ratio.toFixed(2)}`),
      )
    })
  }

  it('has two values for every colour: what an accent or a material adds, it sets in light and in dark', () => {
    // A token of the design it sets again in one theme only keeps the design's value in the other.
    const design = new Set([...Object.keys(themeTokens(SHEETS, 'light')), ...Object.keys(themeTokens(SHEETS, 'dark'))])
    const added = (name: 'accent' | 'material', value: string, theme: 'light' | 'dark') =>
      Object.keys(Object.assign({}, ...SHEETS.map((sheet) => tokensOf(sheet, lookSelectors(name, value, theme)[1]))))
        .filter((token) => !design.has(token))
        .sort()
    for (const accent of ACCENTS.filter((accent) => accent !== 'neutral')) {
      expect(added('accent', accent, 'light'), accent).toContain('--brand')
      expect(added('accent', accent, 'dark'), accent).toEqual(added('accent', accent, 'light'))
    }
    expect(added('material', 'glass', 'light')).toContain('--glass-card')
    expect(added('material', 'glass', 'dark')).toEqual(added('material', 'glass', 'light'))
  })

  it('keeps an accent and a material apart: no token set by both', () => {
    const glass = new Set(
      ['light', 'dark'].flatMap((theme) =>
        lookSelectors('material', 'glass', theme as 'light' | 'dark').flatMap((selector) => SHEETS.flatMap((sheet) => Object.keys(tokensOf(sheet, selector)))),
      ),
    )
    for (const accent of ACCENTS.filter((accent) => accent !== 'neutral')) {
      for (const theme of ['light', 'dark'] as const) {
        const tokens = lookSelectors('accent', accent, theme).flatMap((selector) => SHEETS.flatMap((sheet) => Object.keys(tokensOf(sheet, selector))))
        expect(tokens.filter((token) => glass.has(token)), `${accent}, ${theme}`).toEqual([])
      }
    }
  })

  it('has opaque surfaces, and no blur, where less transparency or more contrast is asked for', () => {
    const asked = inside(read('glass.css'), '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more)')
    expect(tokensOf(asked, ':root[data-material="glass"]')).toMatchObject({ '--glass-blur': 'none', '--glass-sheen': 'none' })
    for (const theme of ['light', 'dark'] as const) {
      const tokens = tokensOf(asked, lookSelectors('material', 'glass', theme)[1])
      for (const surface of ['--glass-float', '--glass-bar', '--glass-card']) expect(parseColor(tokens[surface] ?? '')?.a, `${surface}, ${theme}`).toBe(1)
    }
  })
})
