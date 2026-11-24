// The catalogues: English's keys, each a decision (a word added is a word every language owes: `npx vitest run -u` on
// purpose), and French complete, word for word, none left in English but those French says so.
import { describe, expect, it } from 'vitest'

import { bindMessages } from '../lib/messages.js'
import { en } from './en.js'
import type { Messages } from './en.js'
import { fr } from './fr.js'

type Words = Record<string, unknown>

const entries = (catalogue: Messages) =>
  Object.entries(catalogue as unknown as Record<string, Words>).flatMap(([namespace, words]) =>
    Object.entries(words).map(([key, word]) => ({ id: `${namespace}.${key}`, word })),
  )

/** The words French writes as English does: units and symbols both languages share. */
const SAME_IN_FRENCH = new Set([
  'format.milliseconds',
  'format.seconds',
  'format.minutes',
  'format.hours',
  // A symbol.
  'timeRange.arrow',
  // « Relative », a tab of « Date de début »: French spells it as English does.
  'timeRange.relative',
  // « Total ».
  'chart.total',
  // « Assistant », « Sources », « Code », « Notes », « Notifications ».
  'ai.assistant',
  'ai.sources',
  'ai.codeSnippet',
  'ai.notesLabel',
  'notification.notifications',
  // « Navigation » (the sidebar's group, and the shortcuts' one ⌘K and ⌘B share), « Violet », « Indigo », keys, « Original ».
  'shell.navigation',
  'shortcuts.navigation',
  'look.accentViolet',
  'look.accentIndigo',
  'keys.ctrl',
  'keys.alt',
  'keys.option',
  'keys.tab',
  'code.original',
])

describe('the English catalogue', () => {
  it('has the keys it had: a word added or taken away is a decision', () => {
    const keys = Object.fromEntries(Object.entries(en as unknown as Record<string, Words>).map(([namespace, words]) => [namespace, Object.keys(words).sort()]))
    expect(keys).toMatchSnapshot()
  })

  it('says every word: a string with words, or a function that writes one', () => {
    for (const { id, word } of entries(en)) {
      if (typeof word === 'string') expect(word.trim(), id).not.toBe('')
      else expect(typeof word, id).toBe('function')
    }
  })
})

describe('the French catalogue', () => {
  it('has every word English has, of the same kind: a string for a string, a function of a value for one', () => {
    const french = new Map(entries(fr).map(({ id, word }) => [id, word]))
    const english = entries(en)
    expect([...french.keys()].sort()).toEqual(english.map(({ id }) => id).sort())
    for (const { id, word } of english) {
      const other = french.get(id)
      expect(typeof other, id).toBe(typeof word)
      if (typeof word === 'function' && typeof other === 'function') expect(other.length > 0, `${id} takes a value`).toBe(word.length > 0)
    }
  })

  it('leaves no word in English but those French writes the same', () => {
    const french = new Map(entries(fr).map(({ id, word }) => [id, word]))
    const same = entries(en)
      .filter(({ id, word }) => typeof word === 'string' && french.get(id) === word && !SAME_IN_FRENCH.has(id))
      .map(({ id }) => id)
    expect(same).toEqual([])
    // The list names only words that are the same, and words that are.
    for (const id of SAME_IN_FRENCH) {
      const word = entries(en).find((each) => each.id === id)?.word
      expect(french.get(id), id).toBe(word)
    }
  })

  it('writes with French typography: a no-break space before a colon, a semicolon, an exclamation or question mark', () => {
    const bound = bindMessages(fr, 'fr-FR') as unknown as Record<string, Words>
    for (const [namespace, words] of Object.entries(bound)) {
      for (const [key, word] of Object.entries(words)) {
        if (typeof word !== 'string') continue
        expect(word, `${namespace}.${key}`).not.toMatch(/[^  ][:;!?](\s|$)/)
      }
    }
  })
})
