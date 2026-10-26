/**
 * The design's colour tokens, read from its stylesheets as the browser reads them, and what they
 * make together: a colour over another (a translucent border over its surface), the contrast of a
 * text on a surface (WCAG 2). Pure functions: the Colours page and the contrast test share them.
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

/** The custom properties a stylesheet sets in its blocks of exactly this selector, in order. */
export function tokensOf(css: string, selector: string): Record<string, string> {
  const tokens: Record<string, string> = {}
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const block of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (block[1].trim() !== selector) continue
    for (const declaration of block[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) tokens[declaration[1]] = declaration[2].trim()
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
    const textColour = parseColor(tokens[text] ?? '')
    if (!textColour) continue
    for (const surface of SURFACES) {
      const surfaceColour = parseColor(tokens[surface] ?? '')
      if (surfaceColour) pairs.push({ text, surface, ratio: contrast(textColour, surfaceColour) })
    }
  }
  return pairs
}
