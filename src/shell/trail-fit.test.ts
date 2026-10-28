import { describe, expect, it } from 'vitest'

import { PAGE_STEP_MIN_WIDTH, wholeTrailFits } from './trail-fit.js'

describe('whether the whole trail fits the top bar', () => {
  const steps = { before: [75, 100, 116], gap: 2 }

  it('fits with the page named whole', () => {
    expect(wholeTrailFits({ ...steps, page: 210, room: 75 + 100 + 116 + 3 * 2 + 210 })).toBe(true)
  })

  it('fits with the page’s name cut short, down to the least it may be cut to', () => {
    const before = 75 + 100 + 116 + 3 * 2
    expect(wholeTrailFits({ ...steps, page: 210, room: before + PAGE_STEP_MIN_WIDTH })).toBe(true)
    expect(wholeTrailFits({ ...steps, page: 210, room: before + PAGE_STEP_MIN_WIDTH - 1 })).toBe(false)
  })

  it('does not fit where the steps before the page leave it no room (a chip beside it, a narrow window)', () => {
    expect(wholeTrailFits({ ...steps, page: 210, room: 105 })).toBe(false)
  })

  it('asks no more than a short page name needs', () => {
    expect(wholeTrailFits({ before: [75], gap: 2, page: 60, room: 75 + 2 + 60 })).toBe(true)
  })

  it('fits Home alone, the page at /', () => {
    expect(wholeTrailFits({ before: [], gap: 2, page: 75, room: 80 })).toBe(true)
  })
})
