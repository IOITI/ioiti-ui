import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { findEntry, forgetEntry, readRemembered, REMEMBERED, rememberedKey, rememberEntry } from './spotlight.js'
import { THEME_KEY_ATTRIBUTE } from './theme.js'

const KEY = 'my-app.theme.spotlight.go-to'

beforeEach(() => window.localStorage.clear())
afterEach(() => {
  document.documentElement.removeAttribute(THEME_KEY_ATTRIBUTE)
  vi.restoreAllMocks()
})

describe('rememberedKey', () => {
  it("is under the application's key, as its theme is", () => {
    expect(rememberedKey('go-to')).toBe('ioiti.theme.spotlight.go-to')
    document.documentElement.setAttribute(THEME_KEY_ATTRIBUTE, 'my-app.theme')
    expect(rememberedKey('go-to')).toBe(KEY)
  })
})

describe('the entries remembered', () => {
  it('are the latest first, each once, five at most, and what they need, nothing more', () => {
    for (const id of ['a', 'b', 'c', 'd', 'e', 'f']) rememberEntry(KEY, { id, title: id.toUpperCase(), category: 'Pages', href: `/${id}` })
    rememberEntry(KEY, { id: 'c', title: 'C', category: 'Pages', href: '/c' })
    const read = readRemembered(KEY)
    expect(read.map((entry) => entry.id)).toEqual(['c', 'f', 'e', 'd', 'b'])
    expect(read).toHaveLength(REMEMBERED)

    const told = { id: 'x', title: 'X', category: 'Actions', description: 'Acme · 1,840.00 €' }
    rememberEntry(KEY, told)
    expect(JSON.parse(window.localStorage.getItem(KEY)!)[0]).toEqual({ id: 'x', title: 'X', category: 'Actions' })
  })

  it('pass over what is not a list of entries', () => {
    window.localStorage.setItem(KEY, '{not json')
    expect(readRemembered(KEY)).toEqual([])
    window.localStorage.setItem(KEY, JSON.stringify({ id: 'a' }))
    expect(readRemembered(KEY)).toEqual([])
    window.localStorage.setItem(
      KEY,
      JSON.stringify([{ id: 'a', title: 'A', category: 'Pages' }, { id: 2, title: 'B', category: 'Pages' }, { id: 'c', title: 'C', category: 'Pages', href: 3 }, null]),
    )
    expect(readRemembered(KEY)).toEqual([{ id: 'a', title: 'A', category: 'Pages' }])
    window.localStorage.setItem(KEY, JSON.stringify(Array.from({ length: 9 }, (_, index) => ({ id: `${index}`, title: 'T', category: 'C' }))))
    expect(readRemembered(KEY)).toHaveLength(REMEMBERED)
  })

  it('are forgotten one by one, nothing kept once none is', () => {
    rememberEntry(KEY, { id: 'a', title: 'A', category: 'Pages' })
    rememberEntry(KEY, { id: 'b', title: 'B', category: 'Pages' })
    expect(forgetEntry(KEY, 'b').map((entry) => entry.id)).toEqual(['a'])
    expect(forgetEntry(KEY, 'a')).toEqual([])
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it('hold where the browser keeps nothing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(() => rememberEntry(KEY, { id: 'a', title: 'A', category: 'Pages' })).not.toThrow()
    expect(readRemembered(KEY)).toEqual([])
  })
})

describe('findEntry', () => {
  it('finds an entry by its id among the entries and the lists in them', () => {
    const entries = [{ id: 'orders', items: [{ id: 'o42' }, { id: 'o41', items: [{ id: 'line-1' }] }] }, { id: 'customers' }]
    expect(findEntry(entries, 'customers')).toBe(entries[1])
    expect(findEntry(entries, 'line-1')).toEqual({ id: 'line-1' })
    expect(findEntry(entries, 'nothing')).toBeUndefined()
  })
})
