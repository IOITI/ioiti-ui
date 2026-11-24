import { describe, expect, it } from 'vitest'

import { describeFrench, englishLeft } from './french-pages'

// The first of the two shares of the examples drawn in French (french-pages.ts); the other in french.2.test.tsx.
describeFrench(0, 2)

describe('what the examples in French are held to', () => {
  it('finds a word of English’s catalogue left, as a text or as what a screen reader hears, but one the example writes', () => {
    const root = document.createElement('div')
    root.innerHTML = '<button aria-label="Previous month">‹</button><span>Mois suivant</span><p> Next month </p>'
    expect(englishLeft(root, '', '').sort()).toEqual(['Next month', 'aria-label="Previous month"'])
    expect(englishLeft(root, "const later = 'Next month'", '')).toEqual(['aria-label="Previous month"'])
    expect(englishLeft(root, '', "{ label: 'Previous month' }")).toEqual(['Next month'])
  })
})
