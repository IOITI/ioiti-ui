import { describe, expect, it } from 'vitest'

import { fold, matchRanges, rank, scoreOf, searchIndex, searchWords } from './search.js'

const titled = (...titles: string[]) => titles.map((title) => ({ title }))

describe('fold', () => {
  it('takes off case and accents, and writes out the letters that have none', () => {
    expect(fold('Résumé').text).toBe('resume')
    expect(fold('Brasserie Lefèvre').text).toBe('brasserie lefevre')
    expect(fold('Straße').text).toBe('strasse')
    expect(fold('Œuvre Ærø Łódź').text).toBe('oeuvre aero lodz')
    expect(fold('İstanbul').text).toBe('istanbul')
    expect(fold('Diyarbakır').text).toBe('diyarbakir')
    expect(fold('ΟΔΟΣ').text).toBe(fold('οδος').text)
  })

  it('takes off an accent written after its letter, and points back to where each character comes from', () => {
    const decomposed = fold('Café noir')
    expect(decomposed.text).toBe('cafe noir')
    expect(decomposed.from).toEqual([0, 1, 2, 3, 5, 6, 7, 8, 9, 10])
    expect(fold('Straße').from).toEqual([0, 1, 2, 3, 4, 4, 5, 6])
    expect(fold('😀 Smile')).toEqual({ source: '😀 Smile', text: '😀 smile', from: [0, 0, 2, 3, 4, 5, 6, 7, 8] })
  })

  it('keeps the marks that make another letter: a Japanese sound mark, a Hindi vowel sign', () => {
    expect(fold('ガ').text).toBe('ガ')
    expect(fold('ガイド').text.includes(fold('カ').text)).toBe(false)
    expect(fold('हिन्दी').text).toBe('हिन्दी')
  })
})

describe('searchWords', () => {
  it('are the words typed, folded', () => {
    expect(searchWords('  Résumé  ÉTÉ ')).toEqual(['resume', 'ete'])
    expect(searchWords('   ')).toEqual([])
  })
})

describe('rank', () => {
  const order = (entries: { title: string }[], query: string) => rank(searchIndex(entries), searchWords(query)).map((entry) => entry.title)

  it('puts the title whole first, then its start, a word inside it (IconButton), then inside a word', () => {
    expect(order(titled('Rebuttons', 'IconButton', 'Button link', 'Button'), 'button')).toEqual(['Button', 'Button link', 'IconButton', 'Rebuttons'])
  })

  it('puts the title before a keyword, the category, the description', () => {
    const entries = [
      { title: 'Notes', description: 'Kept as a draft' },
      { title: 'Files', category: 'Drafts' },
      { title: 'Letters', keywords: ['draft'] },
      { title: 'Draft board' },
    ]
    expect(order(entries, 'draft')).toEqual(['Draft board', 'Letters', 'Files', 'Notes'])
  })

  it('needs every word, each anywhere, whatever its accents', () => {
    const entries = [
      { title: 'Order 2026-0042', description: 'Brasserie Lefèvre · 1,840.00 €' },
      { title: 'Order 2026-0041', description: 'Acme · 960.50 €' },
    ]
    expect(order(entries, 'lefevre 0042')).toEqual(['Order 2026-0042'])
    expect(order(entries, 'order')).toEqual(['Order 2026-0042', 'Order 2026-0041'])
    expect(order(entries, 'lefevre acme')).toEqual([])
  })

  it('keeps the order given where entries are worth the same, and while nothing is typed', () => {
    expect(order(titled('Orders b', 'Orders a', 'Orders c'), 'orders')).toEqual(['Orders b', 'Orders a', 'Orders c'])
    expect(order(titled('B', 'A'), ' ')).toEqual(['B', 'A'])
  })

  it('makes a button come first among sixty that mention one', () => {
    const many = [...Array.from({ length: 60 }, (_, index) => ({ title: `Panel ${index}`, description: 'Opens with a button' })), { title: 'Button' }]
    expect(order(many, 'button')[0]).toBe('Button')
    const [button] = searchIndex([{ title: 'Button' }])
    expect(scoreOf(button, ['button'])).toBe(190)
    expect(scoreOf(button, ['link'])).toBeNull()
  })
})

describe('matchRanges', () => {
  it('marks each word where the search finds it, the start of a word first', () => {
    expect(matchRanges('Trespass and passport', ['pass'])).toEqual([[13, 17]])
    expect(matchRanges('Trespass', ['pass'])).toEqual([[4, 8]])
    expect(matchRanges('Résumé', ['resume'])).toEqual([[0, 6]])
  })

  it('marks a letter written as two whole, and an accent written after its letter with it', () => {
    expect(matchRanges('Straße', ['stras'])).toEqual([[0, 5]])
    expect(matchRanges('Café noir', ['cafe'])).toEqual([[0, 5]])
  })

  it('joins the places that meet, and marks nothing for a word not there', () => {
    expect(matchRanges('Order 2026-0042', ['ord', 'order', 'zz'])).toEqual([[0, 5]])
    expect(matchRanges('Order 2026-0042', ['0042', 'order'])).toEqual([
      [0, 5],
      [11, 15],
    ])
  })
})
