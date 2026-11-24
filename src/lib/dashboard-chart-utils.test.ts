import { describe, expect, it } from 'vitest'

import { pctText, shareText } from './dashboard-chart-utils.js'

/** French's no-break spaces (before "%") read as spaces. */
const spaced = (text: string) => text.replace(/\s/g, ' ')

describe('a share a chart writes', () => {
  it('is to the unit from 10 up and to a tenth under, as it always was in English', () => {
    expect(pctText(12.4)).toBe('12%')
    expect(pctText(2.5)).toBe('2.5%')
    expect(pctText(0)).toBe('0.0%')
    expect(pctText(1234.5)).toBe('1235%')
    expect(shareText(0.285)).toBe('28%')
    expect(shareText(0)).toBe('0%')
  })

  it('is rounded as it always was, not as Intl rounds', () => {
    // Math.round and toFixed: Intl rounds a value's shortest decimal, 6.35 up to 6.4.
    expect(pctText(10.5)).toBe('11%')
    expect(pctText(2.25)).toBe('2.3%')
    expect(pctText(6.35)).toBe('6.3%')
  })

  it('writes a loss with a true minus, as the gain of its size', () => {
    expect(pctText(-12.4)).toBe('−12%')
    expect(pctText(-58.5)).toBe('−59%')
    expect(pctText(-2.25)).toBe('−2.3%')
  })

  it('is written as a locale writes a percentage', () => {
    expect(spaced(pctText(12.4, 'fr-FR'))).toBe('12 %')
    expect(spaced(pctText(-2.5, 'fr-FR'))).toBe('−2,5 %')
    expect(spaced(shareText(0.04, 'fr-FR'))).toBe('4 %')
  })
})
