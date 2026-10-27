import { afterEach, describe, expect, it, vi } from 'vitest'

import { seriesColours } from './chart-colours.js'
import { formatTimeTick, niceDomain, timeTicks, zoneOffset } from './chart-scale.js'

describe('a value axis', () => {
  it('starts at zero for values above it', () => {
    expect(niceDomain(12, 87)).toEqual({ min: 0, max: 100, step: 25, ticks: [0, 25, 50, 75, 100] })
  })

  it('goes below zero for losses, zero on it', () => {
    const domain = niceDomain(-120, 340)
    expect(domain.min).toBeLessThanOrEqual(-120)
    expect(domain.max).toBeGreaterThanOrEqual(340)
    expect(domain.ticks).toContain(0)
  })

  it('keeps its ticks free of binary noise', () => {
    expect(niceDomain(0, 0.7).ticks).toEqual([0, 0.2, 0.4, 0.6, 0.8])
  })

  it('has a span where every value is the same', () => {
    expect(niceDomain(0, 0).max).toBeGreaterThan(0)
  })

  it('fits values far from zero when asked', () => {
    const domain = niceDomain(18_120, 18_460, 4, false)
    expect(domain.min).toBeGreaterThan(17_000)
    expect(domain.max).toBeGreaterThanOrEqual(18_460)
  })
})

describe('a time axis', () => {
  it('ticks on round moments of the time zone, at most as many as asked', () => {
    const from = Date.UTC(2026, 9, 27, 8, 7)
    const to = Date.UTC(2026, 9, 27, 14, 50)
    const { ticks, unit } = timeTicks(from, to, 6, 'Europe/Paris')
    expect(unit).toBe('hour')
    expect(ticks.length).toBeLessThanOrEqual(6)
    expect(ticks.every((tick) => formatTimeTick(tick, unit, 'Europe/Paris').endsWith(':00'))).toBe(true)
  })

  it('writes a day as formatDay does', () => {
    expect(formatTimeTick(Date.UTC(2026, 9, 7, 12), 'day')).toBe('07 Oct')
    expect(formatTimeTick(Date.UTC(2026, 9, 27, 12), 'day', 'Europe/Paris')).toBe('27 Oct')
  })

  it('ticks at midnight for days', () => {
    const from = Date.UTC(2026, 9, 1, 13)
    const to = Date.UTC(2026, 9, 20)
    const { ticks, unit } = timeTicks(from, to, 8, 'Europe/Paris')
    expect(unit).toBe('day')
    const first = new Date(ticks[0] + zoneOffset(ticks[0], 'Europe/Paris'))
    expect(first.getUTCHours()).toBe(0)
  })
})

describe('the colours of series', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('gives one series the series colour, and things compared the four compare colours in order', () => {
    expect(seriesColours([undefined])).toEqual(['var(--chart-series)'])
    expect(seriesColours([undefined, undefined, '#123456'])).toEqual(['var(--chart-compare-1)', 'var(--chart-compare-2)', '#123456'])
  })

  it('never recycles a colour: a fifth series is grey, and the developer told', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const colours = seriesColours([undefined, undefined, undefined, undefined, undefined])
    expect(colours[4]).toBe('var(--chart-muted)')
    expect(new Set(colours.slice(0, 4)).size).toBe(4)
    expect(warn).toHaveBeenCalledOnce()
  })
})
