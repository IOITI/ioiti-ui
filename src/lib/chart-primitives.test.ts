import { describe, expect, it } from 'vitest'

import { chartFormatFor, defaultFormat, defaultTick, fullFmt } from './chart-primitives.js'

/** French's no-break spaces (between groups of digits, before "k" and "%") read as spaces. */
const spaced = (text: string) => text.replace(/\s/g, ' ')

describe('the numbers of a chart', () => {
  it('are British English outside a component: its compact units, a true minus', () => {
    expect(defaultTick(1200)).toBe('1.2k')
    expect(defaultTick(-1_500_000)).toBe('−1.5m')
    expect(defaultTick(950)).toBe('950')
    expect(defaultFormat(-1234.56)).toBe('−1,234.6')
    expect(defaultFormat(0.25)).toBe('0.3')
    expect(fullFmt.format(1234.56)).toBe('1,234.6')
  })

  it('are written as a locale writes them, made once for it', () => {
    const french = chartFormatFor('fr-FR')
    expect(spaced(french.tick(1200))).toBe('1,2 k')
    expect(spaced(french.tick(-1000))).toBe('−1 k')
    expect(spaced(french.format(-1234.56))).toBe('−1 234,6')
    expect(spaced(french.percent(12.4))).toBe('12 %')
    expect(spaced(french.percent(2.5))).toBe('2,5 %')
    expect(spaced(french.share(0.04))).toBe('4 %')
    expect(chartFormatFor('fr-FR')).toBe(french)
    expect(chartFormatFor().tick(1200)).toBe('1.2k')
  })
})
