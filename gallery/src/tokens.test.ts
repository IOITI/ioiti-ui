import { readdirSync, readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'

import { ACCENTS, MATERIALS } from 'ioiti-ui'
import { describe, expect, it } from 'vitest'

import {
  CODE_SURFACES,
  CODE_TEXTS,
  colourOf,
  contrast,
  contrastPairs,
  GRAINS,
  gradientColours,
  grainOf,
  inside,
  lookPairs,
  lookSelectors,
  lookTokens,
  parseColor,
  themeTokens,
  toHex,
  tokensOf,
  valueOf,
} from './tokens.js'
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

  it('read a gradient as every colour it shows: its stops, and the sRGB mixes between them', () => {
    const colours = gradientColours('linear-gradient(110deg, #ff0000, oklch(0.5 0 0) 30%, rgb(0 255 0))')
    expect(colours).toHaveLength(21)
    expect([colours[0], colours[10], colours[20]].map(toHex)).toEqual(['#ff0000', toHex(parseColor('oklch(0.5 0 0)')!), '#00ff00'])
    // Half way from red to green is olive: darker than both, which the stops alone would miss.
    const olive = gradientColours('linear-gradient(#ff0000, #00ff00)')[5]
    expect(toHex(olive)).toBe('#808000')
    expect(contrast(olive, parseColor('#000')!)).toBeLessThan(contrast(parseColor('#ff0000')!, parseColor('#000')!))
    expect(gradientColours('var(--brand)')).toEqual([])
    expect(gradientColours(undefined)).toEqual([])
  })
})

describe('the grains', () => {
  // A grain's speck, as its file draws it: a PNG of grey and alpha, 8 bits each, its rows unfiltered
  // (scripts/grains.mjs); its one grey, at its strongest alpha.
  const drawn = (file: Buffer) => {
    let at = 8
    const data: Buffer[] = []
    let header: Buffer = Buffer.alloc(0)
    while (at < file.length) {
      const length = file.readUInt32BE(at)
      const type = file.toString('latin1', at + 4, at + 8)
      if (type === 'IHDR') header = file.subarray(at + 8, at + 8 + length)
      if (type === 'IDAT') data.push(file.subarray(at + 8, at + 8 + length))
      at += 12 + length
    }
    const [width, height] = [header.readUInt32BE(0), header.readUInt32BE(4)]
    expect([header[8], header[9]], 'grey and alpha, 8 bits each').toEqual([8, 4])
    const rows = inflateSync(Buffer.concat(data))
    const greys = new Set<number>()
    let strongest = 0
    for (let y = 0; y < height; y++) {
      const row = y * (1 + 2 * width)
      expect(rows[row], 'an unfiltered row').toBe(0)
      for (let x = 0; x < width; x++) {
        greys.add(rows[row + 1 + 2 * x])
        strongest = Math.max(strongest, rows[row + 2 + 2 * x])
      }
    }
    expect(greys.size, 'one grey').toBe(1)
    const grey = [...greys][0] / 255
    return { r: grey, g: grey, b: grey, a: strongest / 255 }
  }

  it('are read as their files draw them', () => {
    const files = readdirSync('src/styles').filter((name) => name.startsWith('grain-'))
    expect(files.sort()).toEqual(Object.keys(GRAINS).sort())
    for (const file of files) expect(drawn(readFileSync(`src/styles/${file}`)), file).toEqual(GRAINS[file])
  })

  it('are the ones the stylesheets name, read by their name', () => {
    const declared = SHEETS.join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
    const named = [...declared.matchAll(/--brand-grain:\s*([^;]+);/g)].map(([, value]) => value)
    expect(named.length).toBeGreaterThan(0)
    for (const value of named) expect(Object.values(GRAINS), value).toContain(grainOf({ '--brand-grain': value }))
    expect(grainOf({})).toBeUndefined()
    expect(() => grainOf({ '--brand-grain': 'url("./sand.png")' })).toThrow('sand.png')
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
  it('is 20 of them, and neutral and flat are the design as it was', () => {
    expect(LOOKS).toHaveLength(20)
    for (const theme of ['light', 'dark'] as const) {
      expect(lookTokens(SHEETS, { theme, accent: 'neutral', material: 'flat' })).toEqual(themeTokens(SHEETS, theme))
    }
  })

  for (const look of LOOKS) {
    it(`holds its text at 4.5:1 and its marks at 3:1 on every surface: ${named(look)}`, () => {
      const pairs = lookPairs(lookTokens(SHEETS, look), look)
      // Every text colour on every surface was read: none is lost to a format the reader does not know.
      expect(pairs.filter((pair) => pair.minimum === 4.5).length).toBeGreaterThanOrEqual(50)
      // The code colours too, on CodeBlock's surfaces.
      expect(pairs.filter((pair) => pair.text.startsWith('--code-'))).toHaveLength(CODE_TEXTS.length * CODE_SURFACES.length)
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
