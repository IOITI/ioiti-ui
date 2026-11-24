import { afterEach, describe, expect, it, vi } from 'vitest'

import { deprecated } from './deprecated.js'
import { DEPRECATIONS } from './deprecations.js'

describe('a deprecated name given', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('says once, in development, what was given and what replaces it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated('combobox-on-value-change', 'Combobox')
    deprecated('combobox-on-value-change', 'Combobox')
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/^ioiti-ui: a name or a value the package deprecated/)
    expect(warn.mock.calls[0][0]).toContain("(Combobox's onValueChange: onChange)")
  })

  it('names a value with its prop, and what changes with it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated('meter-tone-negative', 'ProgressBar')
    deprecated('hide-close-button', 'SettleModal')
    expect(warn.mock.calls[0][0]).toContain(`(ProgressBar's tone="negative": danger)`)
    expect(warn.mock.calls[1][0]).toContain(`(SettleModal's hideCloseButton: showCloseButton, the other way round`)
  })

  it('says nothing in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    deprecated('panel-dense', 'Panel')
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('the list of what is deprecated', () => {
  it('says of each what replaces it, since which version, and where', () => {
    for (const [id, entry] of Object.entries(DEPRECATIONS) as [string, { kind: string; components?: readonly string[]; prop?: string; old: string; new: string; since: string }][]) {
      expect(entry.old, id).not.toBe('')
      expect(entry.new, id).not.toBe('')
      expect(entry.since, id).toMatch(/^\d+\.\d+\.\d+$/)
      if (entry.kind !== 'export') expect(entry.components?.length, id).toBeGreaterThan(0)
      if (entry.kind === 'value') expect(entry.prop, id).toBeTruthy()
    }
  })
})
