import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { TONE_SOFT } from './recipes.js'
import type { Tone } from './recipes.js'

// A stylesheet imported in a test is empty: read the design's tokens from disk.
const block = (file: string, selector: string) => {
  const css = readFileSync(`src/styles/${file}`, 'utf8')
  const start = css.indexOf(`${selector} {`)
  const body = css.slice(start, css.indexOf('}', start))
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, value]) => [name, value]))
}
const rgb = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16))
const luminance = (colour: number[]) => {
  const [r, g, b] = colour.map((c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const over = (top: number[], alpha: number, bottom: number[]) => top.map((c, i) => c * alpha + bottom[i] * (1 - alpha))

const THEMES = {
  light: { tones: block('theme.css', ':root'), surfaces: block('tokens.css', ':root') },
  dark: { tones: block('theme.css', '.dark'), surfaces: block('tokens.css', '.dark') },
}
const TONES: Exclude<Tone, 'neutral'>[] = ['positive', 'negative', 'warning', 'info']

describe('a tone on its faint ground', () => {
  it.each(Object.entries(THEMES))('keeps its word at 4.5:1 on every surface, a hovered row too (%s)', (theme, { tones, surfaces }) => {
    for (const tone of TONES) {
      const classes = TONE_SOFT[tone].split(' ')
      const ground = classes.find((c) => (theme === 'dark' ? c.startsWith('dark:bg-') : c.startsWith('bg-')))!
      const alpha = Number(ground.split('/')[1]) / 100
      for (const surface of ['--surface', '--surface-hover', '--surface-raised', '--bg']) {
        const text = rgb(tones[`--${tone}`])
        const ratio = contrast(text, over(text, alpha, rgb(surfaces[surface])))
        expect(ratio, `${theme} ${tone} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})
