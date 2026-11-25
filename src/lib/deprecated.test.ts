import { afterEach, describe, expect, it, vi } from 'vitest'

import { deprecated } from './deprecated.js'

// The list is empty from 1.0 until a minor version deprecates again: the tests of what says it give their own.
vi.mock('./deprecations.js', () => ({
  DEPRECATIONS: {
    'test-prop': { kind: 'prop', components: ['Picker'], old: 'onValueChange', new: 'onChange', since: '1.1.0' },
    'test-value': { kind: 'value', components: ['Meter'], prop: 'tone', old: 'negative', new: 'danger', since: '1.1.0' },
    'test-note': {
      kind: 'prop',
      components: ['Modal'],
      old: 'hideCloseButton',
      new: 'showCloseButton',
      since: '1.1.0',
      note: 'the other way round: hideCloseButton is showCloseButton={false}',
    },
  },
}))

// An id of the list, as a minor version fills it (its type is the list's: none in 1.0).
const id = (name: string) => name as never

describe('a deprecated name given', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('says once, in development, what was given and what replaces it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated(id('test-prop'), 'Picker')
    deprecated(id('test-prop'), 'Picker')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/^ioiti-ui: a name or a value the package deprecated/)
    expect(warn.mock.calls[0][0]).toContain("(Picker's onValueChange: onChange)")
  })

  it('names a value with its prop, and what changes with it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated(id('test-value'), 'Meter')
    deprecated(id('test-note'), 'Modal')
    expect(warn.mock.calls[0][0]).toContain(`(Meter's tone="negative": danger)`)
    expect(warn.mock.calls[1][0]).toContain(`(Modal's hideCloseButton: showCloseButton, the other way round`)
  })

  it('says nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated(id('test-prop'), 'Picker')
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('the lists of what is deprecated and of what 1.0 removed', () => {
  it('say of each what replaces it, since which version, and where', async () => {
    const { DEPRECATIONS } = await vi.importActual<typeof import('./deprecations.js')>('./deprecations.js')
    const { REMOVED } = await import('../codemod/table.js')
    const entries = Object.entries({ ...DEPRECATIONS, ...REMOVED }) as [
      string,
      { kind: string; components?: readonly string[]; prop?: string; old: string; new: string; since: string },
    ][]
    expect(entries.length).toBeGreaterThan(0)
    for (const [key, entry] of entries) {
      expect(entry.old, key).not.toBe('')
      expect(entry.new, key).not.toBe('')
      expect(entry.since, key).toMatch(/^\d+\.\d+\.\d+$/)
      if (entry.kind !== 'export') expect(entry.components?.length, key).toBeGreaterThan(0)
      if (entry.kind === 'value') expect(entry.prop, key).toBeTruthy()
    }
  })
})
