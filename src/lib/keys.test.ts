import { describe, expect, it } from 'vitest'

import { fr } from '../locales/fr.js'
import { ariaKeyShortcuts, describeKeys, keyLabels, keysInWords, keysText, matchesStroke, parseKeys } from './keys.js'

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

  it('writes the keys as text where no key cap fits, and as aria-keyshortcuts names them', () => {
    expect(keysText('mod+b', true)).toBe('⌘B')
    expect(keysText('mod+b', false)).toBe('Ctrl B')
    expect(keysText('g o', false)).toBe('G then O')
    expect(ariaKeyShortcuts('mod+b', true)).toBe('Meta+B')
    expect(ariaKeyShortcuts('mod+shift+p', false)).toBe('Control+Shift+P')
    expect(ariaKeyShortcuts('escape', false)).toBe('Escape')
    expect(ariaKeyShortcuts('g o', false)).toBeUndefined()
  })
})

describe('the keys named in a language', () => {
  const shown = (keys: string, apple: boolean) => keyLabels(keys, apple, fr.keys).map((stroke) => stroke.map((label) => label.shown))

  it('names a hint\'s keys in words, joined as a hint writes them: English\'s by default', () => {
    expect(keysInWords('shift+enter', false)).toBe('Shift+Enter')
    expect(keysInWords('shift+enter', true)).toBe('Shift+Enter')
    expect(keysInWords('enter', false)).toBe('Enter')
    expect(keysInWords('mod+k', true)).toBe('Command+K')
    expect(keysInWords('mod+k', false)).toBe('Ctrl+K')
    expect(keysInWords('g o', false)).toBe('G then O')
    // A key cap's own name where it has one, what is said of it where it shows a symbol.
    expect(keysInWords('ctrl+delete', false)).toBe('Ctrl+Del')
    expect(keysInWords('alt+arrowup', true)).toBe('Option+Up arrow')
  })

  it('draws, says and writes them in French, Apple\'s symbols kept, ARIA\'s names English', () => {
    expect(shown('mod+shift+p', false)).toEqual([['Ctrl', 'Maj', 'P']])
    expect(shown('mod+shift+p', true)).toEqual([['⇧', '⌘', 'P']])
    expect(shown('escape', false)).toEqual([['Échap']])
    expect(shown('delete', false)).toEqual([['Suppr']])
    expect(shown('space', false)).toEqual([['Espace']])
    expect(describeKeys('mod+k', true, fr.keys)).toBe('Commande K')
    expect(describeKeys('alt+arrowup', true, fr.keys)).toBe('Option Flèche haut')
    expect(describeKeys('g o', false, fr.keys)).toBe('G puis O')
    expect(keysText('mod+b', false, fr.keys)).toBe('Ctrl B')
    expect(keysText('g o', true, fr.keys)).toBe('G puis O')
    expect(keysInWords('shift+enter', false, fr.keys)).toBe('Maj+Entrée')
    expect(keysInWords('mod+delete', false, fr.keys)).toBe('Ctrl+Suppr')
    expect(keysInWords('mod+escape', true, fr.keys)).toBe('Commande+Échap')
    expect(ariaKeyShortcuts('mod+shift+p', false)).toBe('Control+Shift+P')
  })
})
