import { describe, expect, it } from 'vitest'

import { formatTimeRange, parseDateMath, relativeEnd, resolveTimeRange } from './date-math.js'

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
