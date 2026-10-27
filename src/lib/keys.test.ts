import { describe, expect, it } from 'vitest'

import { describeKeys, keyLabels, matchesStroke, parseKeys } from './keys.js'

const press = (key: string, held: Partial<Record<'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey', boolean>> = {}) => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  ...held,
})

describe('the keys of a shortcut', () => {
  it('reads a stroke, and a sequence of strokes', () => {
    expect(parseKeys('mod+k')).toEqual([{ key: 'k', mod: true, ctrl: false, meta: false, alt: false, shift: false }])
    expect(parseKeys('g o').map((stroke) => stroke.key)).toEqual(['g', 'o'])
    expect(parseKeys('cmd+Esc')[0]).toMatchObject({ key: 'escape', meta: true })
    expect(parseKeys('mod++')[0]).toMatchObject({ key: '+', mod: true })
  })

  it('takes mod for ⌘ on an Apple computer and for Ctrl elsewhere', () => {
    const [stroke] = parseKeys('mod+k')
    expect(matchesStroke(press('k', { metaKey: true }), stroke, true)).toBe(true)
    expect(matchesStroke(press('k', { ctrlKey: true }), stroke, true)).toBe(false)
    expect(matchesStroke(press('k', { ctrlKey: true }), stroke, false)).toBe(true)
    expect(matchesStroke(press('K', { ctrlKey: true, shiftKey: true }), stroke, false)).toBe(false)
  })

  it('asks no Shift of a character Shift types', () => {
    const [stroke] = parseKeys('?')
    expect(matchesStroke(press('?', { shiftKey: true }), stroke, false)).toBe(true)
    expect(matchesStroke(press('/'), stroke, false)).toBe(false)
    expect(matchesStroke(press(' '), parseKeys('space')[0], false)).toBe(true)
  })

  it('draws the keys as each computer writes them, and says them in words', () => {
    expect(keyLabels('mod+shift+p', true).map((stroke) => stroke.map((label) => label.shown))).toEqual([['⇧', '⌘', 'P']])
    expect(keyLabels('mod+shift+p', false).map((stroke) => stroke.map((label) => label.shown))).toEqual([['Ctrl', 'Shift', 'P']])
    expect(describeKeys('mod+k', true)).toBe('Command K')
    expect(describeKeys('g o', false)).toBe('G then O')
    expect(describeKeys('escape', false)).toBe('Escape')
  })
})
