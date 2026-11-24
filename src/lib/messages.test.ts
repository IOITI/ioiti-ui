import { describe, expect, it } from 'vitest'

import { bindMessages, kitFor, mergeMessages } from './messages.js'
import type { MessageKit } from './messages.js'

const catalogue = {
  date: {
    today: 'Today',
    lastDays: (count: number, { plural }: MessageKit) => plural(count, { one: 'Last day', other: 'Last # days' }),
  },
  format: { ago: (duration: string) => `${duration} ago` },
}

describe('the kit of a locale', () => {
  it('chooses the plural form the locale’s rules say, its count written as the locale writes numbers', () => {
    const english = kitFor('en-GB')
    expect(english.plural(1, { one: '# day', other: '# days' })).toBe('1 day')
    expect(english.plural(1500, { one: '# day', other: '# days' })).toBe('1,500 days')
    const french = kitFor('fr-FR')
    // French says "0 jour" and "1,5 jour": `one` covers them.
    expect(french.plural(0, { one: '# jour', other: '# jours' })).toBe('0 jour')
    expect(french.plural(1500, { one: '# jour', other: '# jours' })).toBe('1 500 jours')
  })

  it('falls back to `other` for a form not given', () => {
    expect(kitFor('pl-PL').plural(3, { one: '# dzień', other: '# dni' })).toBe('3 dni')
  })

  it('joins words as the locale joins them', () => {
    expect(kitFor('en-GB').list(['a', 'b', 'c'])).toBe('a, b and c')
    expect(kitFor('fr-FR').list(['a', 'b', 'c'])).toBe('a, b et c')
    expect(kitFor('en-GB').list(['a', 'b'], 'disjunction')).toBe('a or b')
  })

  it('is made once per locale', () => {
    expect(kitFor('en-GB')).toBe(kitFor('en-GB'))
  })
})

describe('a catalogue', () => {
  it('is bound to a locale: a word that takes values called with them alone', () => {
    const words = bindMessages(catalogue, 'en-GB')
    expect(words.date.today).toBe('Today')
    expect(words.date.lastDays(7)).toBe('Last 7 days')
    expect(words.date.lastDays(1)).toBe('Last day')
    expect(words.format.ago('5 min')).toBe('5 min ago')
  })

  it('is bound once per locale', () => {
    expect(bindMessages(catalogue, 'en-GB')).toBe(bindMessages(catalogue, 'en-GB'))
    expect(bindMessages(catalogue, 'fr-FR')).not.toBe(bindMessages(catalogue, 'en-GB'))
  })

  it('takes words given over it, namespace by namespace, the others kept', () => {
    const merged = mergeMessages(catalogue, { date: { today: 'Now' } }, undefined, { format: { ago: (d: string) => `il y a ${d}` } })
    expect(merged.date.today).toBe('Now')
    expect(merged.date.lastDays).toBe(catalogue.date.lastDays)
    expect(bindMessages(merged, 'fr-FR').format.ago('5 min')).toBe('il y a 5 min')
    // The base is left as it was.
    expect(catalogue.date.today).toBe('Today')
  })
})
