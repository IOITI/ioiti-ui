/**
 * The design's colour tokens, read from its stylesheets as the browser reads them, and what they
 * make together: a colour over another (a translucent border over its surface, glass over the
 * backdrop), the contrast of a text on a surface (WCAG 2), for every look: a theme, an accent and a
 * material. Pure functions: the Colours page and the contrast test share them.
 */

/** A colour: sRGB channels from 0 to 1, and its opacity. */
export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

function channel(text: string, scale: number): number {
  return text.endsWith('%') ? Number.parseFloat(text) / 100 : Number.parseFloat(text) / scale
}

function encode(linear: number): number {
  const value = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055
  return Math.min(1, Math.max(0, value))
}

/** OKLCH (lightness 0–1, chroma, hue in degrees) to sRGB, as CSS defines it. */
function oklch(lightness: number, chroma: number, hue: number): Omit<Rgba, 'a'> {
  const angle = (hue * Math.PI) / 180
  const a = chroma * Math.cos(angle)
  const b = chroma * Math.sin(angle)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

/** A colour as the stylesheets write them (`#fafafa`, `rgba(10, 10, 10, 0.05)`, `oklch(0.92 0.004 286 / 10%)`); null otherwise. */
export function parseColor(value: string): Rgba | null {
  const text = value.trim().toLowerCase()
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(text)
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((digit) => digit + digit).join('') : hex[1]
    const [r, g, b] = [0, 2, 4].map((at) => Number.parseInt(digits.slice(at, at + 2), 16) / 255)
    return { r, g, b, a: 1 }
  }
  const rgb = /^rgba?\(([^)]+)\)$/.exec(text)
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean)
    return { r: channel(parts[0], 255), g: channel(parts[1], 255), b: channel(parts[2], 255), a: parts[3] ? channel(parts[3], 1) : 1 }
  }
  const ok = /^oklch\(([^)]+)\)$/.exec(text)
  if (ok) {
    const [color, alpha] = ok[1].split('/')
    const [lightness, chroma, hue] = color.trim().split(/\s+/)
    return { ...oklch(channel(lightness, 1), Number.parseFloat(chroma), Number.parseFloat(hue)), a: alpha ? channel(alpha.trim(), 1) : 1 }
  }
  return null
}

/** A translucent colour over an opaque one, as the browser paints it. */
export function over(top: Rgba, bottom: Rgba): Rgba {
  const mix = (front: number, back: number) => front * top.a + back * (1 - top.a)
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 }
}

function luminance({ r, g, b }: Rgba): number {
  const linear = (value: number) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/** WCAG 2's contrast ratio of a text on a surface, from 1 to 21. Small text needs 4.5. */
export function contrast(text: Rgba, surface: Rgba): number {
  const [light, dark] = [luminance(over(text, surface)), luminance(surface)].sort((first, second) => second - first)
  return (light + 0.05) / (dark + 0.05)
}

/** `#rrggbb` of an opaque colour. */
export function toHex({ r, g, b }: Rgba): string {
  return `#${[r, g, b].map((value) => Math.round(value * 255).toString(16).padStart(2, '0')).join('')}`
}

interface Rule {
  /** What precedes its block, after the last statement (`@import …;`). */
  selector: string
  body: string
}

/**
 * The blocks of a stylesheet at its top level, in order. What sits inside an at-rule (`@media`,
 * `@supports`, `@theme`, `@utility`, `@layer`) applies under a condition, or is no token: left out.
 */
function rulesOf(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules: Rule[] = []
  let depth = 0
  let start = 0
  let open = 0
  for (let at = 0; at < text.length; at++) {
    if (text[at] === '{') {
      if (depth === 0) open = at
      depth++
    } else if (text[at] === '}') {
      depth--
      if (depth === 0) {
        const head = text.slice(start, open)
        rules.push({ selector: head.slice(head.lastIndexOf(';') + 1).trim(), body: text.slice(open + 1, at) })
        start = at + 1
      }
    }
  }
  return rules
}

/** What a stylesheet sets inside its at-rules that start so (`@media (prefers-reduced-transparency`), as a stylesheet. */
export function inside(css: string, prelude: string): string {
  return rulesOf(css)
    .filter((rule) => rule.selector.startsWith(prelude))
    .map((rule) => rule.body)
    .join('\n')
}

/** The custom properties a stylesheet sets in its top-level blocks of exactly this selector, in order. */
export function tokensOf(css: string, selector: string): Record<string, string> {
  const tokens: Record<string, string> = {}
  for (const rule of rulesOf(css)) {
    if (rule.selector !== selector) continue
    for (const declaration of rule.body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens[declaration[1]] = declaration[2].trim()
  }
  return tokens
}

export type ThemeName = 'light' | 'dark'

/**
 * The tokens of a theme as a page gets them, from the stylesheets in the order they are imported
 * (tokens.css, theme.css, design.css): a later one sets a token again and wins. The dark theme
 * keeps what only `:root` sets (radius, fonts).
 */
export function themeTokens(sheets: string[], theme: ThemeName): Record<string, string> {
  const merged: Record<string, string> = {}
  for (const sheet of sheets) Object.assign(merged, tokensOf(sheet, ':root'))
  if (theme === 'light') for (const sheet of sheets) Object.assign(merged, tokensOf(sheet, ':root:not(.dark)'))
  else for (const sheet of sheets) Object.assign(merged, tokensOf(sheet, '.dark'))
  return merged
}

/** A theme, an accent and a material: what a page shows. */
export interface Look {
  theme: ThemeName
  accent: string
  material: string
}

/** The selectors of an accent's or a material's blocks: what both themes share, then the theme's own. */
export function lookSelectors(name: 'accent' | 'material', value: string, theme: ThemeName): string[] {
  const root = `:root[data-${name}="${value}"]`
  return [root, theme === 'dark' ? `${root}.dark` : `${root}:not(.dark)`]
}

/**
 * The tokens of a look: its theme's, then its accent's and its material's blocks, which are more
 * specific than the design's (accents.css, glass.css). Neutral and flat have none.
 */
export function lookTokens(sheets: string[], { theme, accent, material }: Look): Record<string, string> {
  const merged = themeTokens(sheets, theme)
  const chosen = [accent === 'neutral' ? [] : lookSelectors('accent', accent, theme), material === 'flat' ? [] : lookSelectors('material', material, theme)]
  for (const selector of chosen.flat()) for (const sheet of sheets) Object.assign(merged, tokensOf(sheet, selector))
  return merged
}

function evaluate(tokens: Record<string, string>, text: string, seen: string[]): string | undefined {
  const reference = /^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/.exec(text.trim())
  if (!reference) return text.trim()
  const [, other, fallback] = reference
  if (tokens[other] !== undefined && !seen.includes(other)) return evaluate(tokens, tokens[other], [...seen, other])
  return fallback === undefined ? undefined : evaluate(tokens, fallback, seen)
}

/** A token's value with a `var(--other)` followed, as the browser does: its fallback where the other is unset. */
export function valueOf(tokens: Record<string, string>, name: string): string | undefined {
  return tokens[name] === undefined ? undefined : evaluate(tokens, tokens[name], [name])
}

/** A token's colour, its references followed; null when it is no colour. */
export function colourOf(tokens: Record<string, string>, name: string): Rgba | null {
  return parseColor(valueOf(tokens, name) ?? '')
}

/** The surfaces text is read on, and the text colours the design promises 4.5:1 on all of them. */
export const SURFACES = ['--background', '--bg', '--surface', '--surface-raised', '--surface-hover']
export const TEXTS = [
  '--foreground',
  '--text-primary',
  '--text-secondary',
  '--muted-foreground',
  '--text-muted',
  '--text-subtle',
  '--positive',
  '--negative',
  '--warning',
  '--info',
]

export interface Pair {
  text: string
  surface: string
  ratio: number
}

/** Every text colour on every surface of a theme, with its contrast. */
export function contrastPairs(tokens: Record<string, string>): Pair[] {
  const pairs: Pair[] = []
  for (const text of TEXTS) {
    const textColour = colourOf(tokens, text)
    if (!textColour) continue
    for (const surface of SURFACES) {
      const surfaceColour = colourOf(tokens, surface)
      if (surfaceColour) pairs.push({ text, surface, ratio: contrast(textColour, surfaceColour) })
    }
  }
  return pairs
}

/** A pair of a look, and what it must reach: 4.5:1 for text, 3:1 for a mark (a fill that says a state, the focus ring). */
export interface LookPair extends Pair {
  minimum: number
}

/** The glass surfaces, from the most opaque. */
export const GLASS_SURFACES = ['--glass-float', '--glass-bar', '--glass-card']

/**
 * What text and marks are read on in a look, each surface as the colours it can show. An opaque
 * surface is one colour. Glass shows the backdrop through it: the page's base, and the strongest point
 * of each wash over it (the accent's in place of the first, as glass.css paints it), a dialog its scrim
 * too. Text set straight on the page is read on the backdrop itself.
 */
export function lookSurfaces(tokens: Record<string, string>, look: Look): Record<string, Rgba[]> {
  const surfaces: Record<string, Rgba[]> = {}
  for (const name of SURFACES) {
    const colour = colourOf(tokens, name)
    if (colour) surfaces[name] = [colour]
  }
  if (look.material !== 'glass') return surfaces
  const base = colourOf(tokens, '--glass-base')
  if (!base) return surfaces
  const washes = [look.accent === 'neutral' ? '--glass-tint-1' : '--brand-wash', '--glass-tint-2', '--glass-tint-3']
  const backdrop = [base, ...washes.flatMap((wash) => {
    const colour = colourOf(tokens, wash)
    return colour ? [over(colour, base)] : []
  })]
  surfaces.backdrop = backdrop
  // Each surface as it is, and where its light and its reflection are strongest.
  const lights = ['--glass-shine', '--glass-reflection'].flatMap((name) => {
    const colour = colourOf(tokens, name)
    return colour ? [colour] : []
  })
  for (const name of GLASS_SURFACES) {
    const colour = colourOf(tokens, name)
    if (colour)
      surfaces[name] = backdrop.flatMap((under) => {
        const surface = over(colour, under)
        return [surface, ...lights.map((light) => over(light, surface))]
      })
  }
  // A dialog: what floats, over its scrim, over the page.
  const float = colourOf(tokens, '--glass-float')
  const scrim = colourOf(tokens, '--glass-scrim')
  if (float && scrim) surfaces['--glass-float on --glass-scrim'] = backdrop.map((under) => over(float, over(scrim, under)))
  return surfaces
}

/**
 * Every pair a look must hold, at its worst over the colours a surface can show: each text colour (the
 * accent's too) on each surface; with an accent, its text on the tint of a chosen item over each
 * surface, the text on its fill, and its fill against each surface; the focus ring against each.
 */
export function lookPairs(tokens: Record<string, string>, look: Look): LookPair[] {
  const surfaces = Object.entries(lookSurfaces(tokens, look))
  const pairs: LookPair[] = []
  const worst = (colour: Rgba, under: Rgba[]) => Math.min(...under.map((surface) => contrast(colour, surface)))
  const add = (text: string, minimum: number, on: [string, Rgba[]][] = surfaces) => {
    const colour = colourOf(tokens, text)
    if (colour) for (const [surface, under] of on) pairs.push({ text, surface, ratio: worst(colour, under), minimum })
  }
  for (const text of look.accent === 'neutral' ? TEXTS : [...TEXTS, '--brand-text']) add(text, 4.5)
  add('--focus-ring', 3)
  if (look.accent === 'neutral') return pairs
  add('--brand', 3)
  const soft = colourOf(tokens, '--brand-soft')
  if (soft) add('--brand-text', 4.5, surfaces.map(([surface, under]) => [`--brand-soft on ${surface}`, under.map((colour) => over(soft, colour))]))
  const fill = colourOf(tokens, '--brand')
  if (fill) add('--brand-foreground', 4.5, [['--brand', [fill]]])
  return pairs
}
