import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { formatTimeRange, formatTimeRangeEnd, parseDateMath, relativeEnd, resolveTimeRange } from './date-math.js'
import { bindMessages } from './messages.js'

// Tuesday 27 October 2026, 14:37:12.345, in the browser's time zone.
const NOW = new Date(2026, 9, 27, 14, 37, 12, 345).getTime()

describe('date maths', () => {
  it('reads now, moved and rounded', () => {
    expect(parseDateMath('now', { now: NOW })?.getTime()).toBe(NOW)
    expect(parseDateMath('now-15m', { now: NOW })).toEqual(new Date(2026, 9, 27, 14, 22, 12, 345))
    expect(parseDateMath('now+2h', { now: NOW })).toEqual(new Date(2026, 9, 27, 16, 37, 12, 345))
    expect(parseDateMath('now/d', { now: NOW })).toEqual(new Date(2026, 9, 27))
    expect(parseDateMath('now/d', { now: NOW, roundUp: true })).toEqual(new Date(2026, 9, 27, 23, 59, 59, 999))
    expect(parseDateMath('now-1d/d', { now: NOW })).toEqual(new Date(2026, 9, 26))
    expect(parseDateMath('now/w', { now: NOW })).toEqual(new Date(2026, 9, 26))
    expect(parseDateMath('now/w', { now: NOW, weekStartsOn: 0 })).toEqual(new Date(2026, 9, 25))
    expect(parseDateMath('now/M', { now: NOW })).toEqual(new Date(2026, 9, 1))
    expect(parseDateMath('now-1M/M', { now: NOW, roundUp: true })).toEqual(new Date(2026, 9, 1, 0, 0, 0, -1))
  })

  it('reads a moment written out, and nothing else', () => {
    expect(parseDateMath('2026-10-01T09:30:00Z')?.toISOString()).toBe('2026-10-01T09:30:00.000Z')
    expect(parseDateMath('now-15x')).toBeNull()
    expect(parseDateMath('yesterday')).toBeNull()
  })

  it('gives the two moments of a range, its end rounded up', () => {
    expect(resolveTimeRange({ from: 'now/d', to: 'now/d' }, { now: NOW })).toEqual({
      from: new Date(2026, 9, 27),
      to: new Date(2026, 9, 27, 23, 59, 59, 999),
    })
  })

  it('reads an end moved by one step', () => {
    expect(relativeEnd('now-15m')).toEqual({ past: true, count: 15, unit: 'm', round: undefined })
    expect(relativeEnd('now+1d/d')).toEqual({ past: false, count: 1, unit: 'd', round: 'd' })
    expect(relativeEnd('now')).toBeNull()
  })
})

describe('a range in words', () => {
  it('says what people say', () => {
    expect(formatTimeRange({ from: 'now-15m', to: 'now' })).toBe('Last 15 minutes')
    expect(formatTimeRange({ from: 'now-1h', to: 'now' })).toBe('Last 1 hour')
    expect(formatTimeRange({ from: 'now', to: 'now+7d' })).toBe('Next 7 days')
    expect(formatTimeRange({ from: 'now/d', to: 'now/d' })).toBe('Today')
    expect(formatTimeRange({ from: 'now/w', to: 'now/w' })).toBe('This week')
  })

  it('says its two ends otherwise', () => {
    expect(formatTimeRange({ from: 'now-2d/d', to: 'now' })).toBe('2 days ago, to the day → now')
    expect(formatTimeRange({ from: '2026-10-01T09:30:00', to: 'now-1h' })).toBe('1 Oct 2026, 09:30 → 1 hour ago')
  })
})

describe('an end in words', () => {
  it('says now, a time from now, and a moment, its own name or none', () => {
    expect(formatTimeRangeEnd('now')).toBe('now')
    expect(formatTimeRangeEnd('now-15m')).toBe('15 minutes ago')
    expect(formatTimeRangeEnd('now+1h/h')).toBe('in 1 hour, to the hour')
    // An end alone names no range: `now/d` is a moment, not "Today".
    expect(formatTimeRangeEnd('now/d', 'en-GB', { now: NOW })).toBe('27 Oct 2026, 00:00')
    expect(formatTimeRangeEnd('yesterday')).toBe('yesterday')
  })

  it('reads the end of a range rounded up, as resolveTimeRange does', () => {
    expect(formatTimeRangeEnd('now/d', 'en-GB', { now: NOW, roundUp: true })).toBe('27 Oct 2026, 23:59')
    expect(formatTimeRange({ from: 'now-2d', to: 'now/d' }, 'en-GB', { now: NOW })).toBe('2 days ago → 27 Oct 2026, 23:59')
  })

  it('starts a week on the day given', () => {
    expect(formatTimeRangeEnd('now/w', 'en-GB', { now: NOW })).toBe('26 Oct 2026, 00:00')
    expect(formatTimeRangeEnd('now/w', 'en-GB', { now: NOW, weekStartsOn: 0 })).toBe('25 Oct 2026, 00:00')
  })

  it('writes a moment with the locale’s clock, or the one given', () => {
    const range = { from: '2026-10-01T21:30:00', to: 'now' }
    expect(formatTimeRange(range, 'en-US')).toBe('Oct 1, 2026, 09:30 PM → now')
    expect(formatTimeRange(range, 'en-US', { hourCycle: 'h23' })).toBe('Oct 1, 2026, 21:30 → now')
    expect(formatTimeRange(range, 'en-GB', { hourCycle: 'h12' })).toBe('1 Oct 2026, 09:30 pm → now')
  })
})

describe('a range in French', () => {
  const french = { words: fr.timeRange }

  it('names a span after its count, agreeing with its unit', () => {
    expect(formatTimeRange({ from: 'now-15m', to: 'now' }, 'fr-FR', french)).toBe('15 dernières minutes')
    expect(formatTimeRange({ from: 'now-24h', to: 'now' }, 'fr-FR', french)).toBe('24 dernières heures')
    expect(formatTimeRange({ from: 'now-7d', to: 'now' }, 'fr-FR', french)).toBe('7 derniers jours')
    expect(formatTimeRange({ from: 'now-3M', to: 'now' }, 'fr-FR', french)).toBe('3 derniers mois')
    expect(formatTimeRange({ from: 'now-2y', to: 'now' }, 'fr-FR', french)).toBe('2 dernières années')
    expect(formatTimeRange({ from: 'now', to: 'now+2w' }, 'fr-FR', french)).toBe('2 prochaines semaines')
    // One alone, without its count, as French says it.
    expect(formatTimeRange({ from: 'now-1h', to: 'now' }, 'fr-FR', french)).toBe('Dernière heure')
    expect(formatTimeRange({ from: 'now-1y', to: 'now' }, 'fr-FR', french)).toBe('Dernière année')
    expect(formatTimeRange({ from: 'now', to: 'now+1d' }, 'fr-FR', french)).toBe('Prochain jour')
    // The count as French writes a number.
    expect(formatTimeRange({ from: 'now-1500m', to: 'now' }, 'fr-FR', french)).toBe('1\u202f500 dernières minutes')
  })

  it('names the ranges that have a name', () => {
    expect(formatTimeRange({ from: 'now/d', to: 'now/d' }, 'fr-FR', french)).toBe('Aujourd’hui')
    expect(formatTimeRange({ from: 'now/w', to: 'now/w' }, 'fr-FR', french)).toBe('Cette semaine')
    expect(formatTimeRange({ from: 'now-1w/w', to: 'now-1w/w' }, 'fr-FR', french)).toBe('La semaine dernière')
    expect(formatTimeRange({ from: 'now-1M/M', to: 'now-1M/M' }, 'fr-FR', french)).toBe('Le mois dernier')
    expect(formatTimeRange({ from: 'now/y', to: 'now' }, 'fr-FR', french)).toBe('Cette année jusqu’à présent')
  })

  it('says its ends otherwise', () => {
    expect(formatTimeRange({ from: 'now-2d/d', to: 'now' }, 'fr-FR', french)).toBe('il y a 2 jours, arrondi au jour → maintenant')
    expect(formatTimeRange({ from: '2026-10-01T09:30:00', to: 'now+3h' }, 'fr-FR', french)).toBe('1 oct. 2026, 09:30 → dans 3 heures')
    expect(formatTimeRangeEnd('now-1y', 'fr-FR', french)).toBe('il y a 1 an')
    expect(formatTimeRangeEnd('now+1h/h', 'fr-FR', french)).toBe('dans 1 heure, arrondi à l’heure')
  })

  it('takes the words bound to the locale, as useMessages gives them', () => {
    const bound = { words: bindMessages(fr, 'fr-FR').timeRange }
    expect(formatTimeRange({ from: 'now-7d', to: 'now' }, 'fr-FR', bound)).toBe('7 derniers jours')
    expect(formatTimeRange({ from: 'now-2d/d', to: 'now' }, 'fr-FR', bound)).toBe('il y a 2 jours, arrondi au jour → maintenant')
  })
})
