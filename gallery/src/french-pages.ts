// Every example of the gallery drawn in French (IoitiProvider locale="fr-FR" messages={fr}), its pages shared among two
// test files that run side by side (french.test.tsx, french.2.test.tsx): no word of English's catalogue left in it, as
// a text or as what a screen reader hears (aria-label, placeholder, title…), but one its own source or the gallery's
// sample data writes (an example's own words are the application's, English in the gallery). A word the package says
// outside its catalogue is the strings check's (scripts/check-strings.mjs).
import { cleanup } from '@testing-library/react'
import type { Messages } from 'ioiti-ui'
import { en } from 'ioiti-ui/locales/en'
import { fr } from 'ioiti-ui/locales/fr'
import { describe, expect, it } from 'vitest'

import type { Examples } from './catalogue/types'
import { A_PAGE, heading, renderAt } from './gallery-pages'
import { PAGES } from './routes'

/** Each example's source, by `<category>/<family>/<example>`. */
const SOURCES = new Map<string, string>()
for (const [path, module] of Object.entries(import.meta.glob<{ default: Examples }>('./components/*/examples.ts', { eager: true }))) {
  const category = path.split('/').at(-2)
  for (const [key, example] of Object.entries(module.default)) SOURCES.set(`${category}/${key}`, example.source)
}

/** The gallery's sample data (gallery/src/samples): the application's own words, as an example's are. */
const SAMPLES = Object.values(import.meta.glob<string>('./samples/*.ts', { eager: true, query: '?raw', import: 'default' })).join('\n')

/** English's words that French says otherwise: what must not be heard in French. */
const ENGLISH = new Set<string>()
for (const [namespace, words] of Object.entries(en as unknown as Record<string, Record<string, unknown>>)) {
  const french = (fr as unknown as Record<string, Record<string, unknown>>)[namespace] ?? {}
  for (const [key, word] of Object.entries(words)) {
    if (typeof word === 'string' && word !== french[key] && /\p{L}{2}/u.test(word)) ENGLISH.add(word)
  }
}

/** What a screen reader hears of an element besides its text. */
const SAID = ['aria-label', 'aria-description', 'aria-valuetext', 'aria-roledescription', 'placeholder', 'title', 'alt']

/** The words of English's catalogue in an example drawn in French, but those its own source or the samples write. */
export function englishLeft(root: Element, source: string, samples = SAMPLES): string[] {
  const left = new Set<string>()
  const said = (text: string, where = '') => {
    const word = text.replace(/\s+/g, ' ').trim()
    if (ENGLISH.has(word) && !source.includes(word) && !samples.includes(word)) left.add(where ? `${where}="${word}"` : word)
  }
  const texts = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = texts.nextNode(); node; node = texts.nextNode()) said(node.textContent ?? '')
  for (const element of [root, ...root.querySelectorAll('*')]) {
    for (const name of SAID) {
      const value = element.getAttribute(name)
      if (value) said(value, name)
    }
  }
  return [...left]
}

/** The tests of the families' pages whose place among them is `part`, counted in `parts`: one file's share. */
export function describeFrench(part: number, parts: number) {
  const families = PAGES.filter((page) => page.family && page.category)
  describe(`every example in French (${part + 1} of ${parts})`, () => {
    for (const page of families.filter((_, index) => index % parts === part)) {
      it(`${page.path}: no word of English's catalogue left`, async () => {
        renderAt(page.path, { locale: 'fr-FR', messages: fr satisfies Messages })
        expect(await heading()).not.toHaveLength(0)
        const left: string[] = []
        for (const example of page.family!.examples) {
          const root = document.querySelector(`[data-example="${example.id}"]`)
          const source = SOURCES.get(`${page.category!.slug}/${page.family!.slug}/${example.id}`) ?? ''
          if (root) left.push(...englishLeft(root, source).map((word) => `${example.id}: ${word}`))
        }
        expect(left, 'English left in French').toEqual([])
        cleanup()
      }, A_PAGE)
    }
  })
}
