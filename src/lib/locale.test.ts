import { afterEach, describe, expect, it, vi } from 'vitest'

import { firstDayOf, hourCycleOf, numberSymbolsOf, parseLocaleNumber } from './locale.js'

describe('the first day of the week', () => {
  afterEach(() => vi.restoreAllMocks())

  it('is the locale’s: Monday in Britain and France, Sunday in the United States, Saturday in Egypt', () => {
    expect(firstDayOf('en-GB')).toBe(1)
    expect(firstDayOf('fr-FR')).toBe(1)
    expect(firstDayOf('en-US')).toBe(0)
    expect(firstDayOf('ar-EG')).toBe(6)
  })

  it('is CLDR’s where the browser cannot say it (Firefox has no weekInfo), a language alone where it is most spoken', () => {
    // As Firefox: neither the method nor the older getter (V8 has both).
    const proto = Intl.Locale.prototype as Intl.Locale & { getWeekInfo?: () => unknown; weekInfo?: unknown }
    if (proto.getWeekInfo) vi.spyOn(proto as { getWeekInfo: () => unknown }, 'getWeekInfo').mockReturnValue(undefined)
    if (Object.getOwnPropertyDescriptor(proto, 'weekInfo')?.get)
      vi.spyOn(proto as { weekInfo: unknown }, 'weekInfo', 'get').mockReturnValue(undefined)
    const tag = new Intl.Locale('en-US') as Intl.Locale & { getWeekInfo?: () => unknown; weekInfo?: unknown }
    expect(tag.getWeekInfo?.() ?? tag.weekInfo).toBeUndefined()

    expect(firstDayOf('en-US')).toBe(0)
    expect(firstDayOf('en')).toBe(0)
    expect(firstDayOf('fr')).toBe(1)
    expect(firstDayOf('en-GB')).toBe(1)
    expect(firstDayOf('ar-EG')).toBe(6)
  })

  it('is the default locale’s for a tag Intl does not take', () => {
    expect(firstDayOf('not a locale')).toBe(1)
  })
})

describe('the clock', () => {
  it('is the locale’s: 24 hours in Britain and France, 12 in the United States', () => {
    expect(hourCycleOf('en-GB')).toBe('h23')
    expect(hourCycleOf('fr-FR')).toBe('h23')
    expect(hourCycleOf('en-US')).toBe('h12')
  })
})

describe('a number typed', () => {
  it('knows how the locale writes one', () => {
    expect(numberSymbolsOf('en-GB')).toMatchObject({ decimal: '.', group: ',' })
    expect(numberSymbolsOf('fr-FR')).toMatchObject({ decimal: ',', group: ' ' })
    expect(numberSymbolsOf('de-DE')).toMatchObject({ decimal: ',', group: '.' })
  })

  it('is read as its locale writes it', () => {
    expect(parseLocaleNumber('1,234.5', 'en-GB')).toBe(1234.5)
    expect(parseLocaleNumber('1 234,5', 'fr-FR')).toBe(1234.5)
    expect(parseLocaleNumber('1 234,5', 'fr-FR')).toBe(1234.5)
    expect(parseLocaleNumber('1.234,5', 'de-DE')).toBe(1234.5)
    expect(parseLocaleNumber('1’234.5', 'de-CH')).toBe(1234.5)
  })

  it('takes a dot for a decimal one in every locale, as people type it', () => {
    expect(parseLocaleNumber('1234.5', 'fr-FR')).toBe(1234.5)
    expect(parseLocaleNumber('0.5', 'de-DE')).toBe(0.5)
  })

  it('takes a separator alone between groups of three for the locale’s grouping one, any other for the decimal one', () => {
    expect(parseLocaleNumber('1,500', 'en-GB')).toBe(1500)
    expect(parseLocaleNumber('1,5', 'en-GB')).toBe(1.5)
    expect(parseLocaleNumber('1,50', 'en-GB')).toBe(1.5)
    expect(parseLocaleNumber('1,500', 'fr-FR')).toBe(1.5)
    expect(parseLocaleNumber('1.500', 'de-DE')).toBe(1500)
    expect(parseLocaleNumber('1.500', 'en-GB')).toBe(1.5)
    expect(parseLocaleNumber('1,234,567', 'en-GB')).toBe(1234567)
    expect(parseLocaleNumber('1,23,456', 'en-IN')).toBe(123456)
  })

  it('never takes a separator after a 0, or before nothing, for a grouping one', () => {
    expect(parseLocaleNumber('0,123', 'en-GB')).toBe(0.123)
    expect(parseLocaleNumber('00,500', 'en-GB')).toBe(0.5)
    expect(parseLocaleNumber(',500', 'en-GB')).toBe(0.5)
    expect(parseLocaleNumber('0.500', 'de-DE')).toBe(0.5)
    expect(parseLocaleNumber('0,123,456', 'en-GB')).toBeNaN()
  })

  it('reads a sign, a true minus too, and the spaces around', () => {
    expect(parseLocaleNumber(' -12,5 ', 'fr-FR')).toBe(-12.5)
    expect(parseLocaleNumber('−12.5', 'en-GB')).toBe(-12.5)
    expect(parseLocaleNumber('+3', 'en-GB')).toBe(3)
    expect(parseLocaleNumber(',5', 'fr-FR')).toBe(0.5)
  })

  it('is no number when it is not one', () => {
    for (const text of ['', ' ', 'abc', '1,2,3', '12,34.5', '1.2.3', '1e5', '-', '.', '1,234.5.6']) {
      expect(parseLocaleNumber(text, 'en-GB'), text).toBeNaN()
    }
  })
})
