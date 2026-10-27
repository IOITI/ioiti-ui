import { describe, expect, it } from 'vitest'

import { placeBeside } from './anchor.js'

const VIEW = { width: 1000, height: 800 }
const rect = (left: number, top: number, width = 100, height = 32) => ({ left, top, width, height, right: left + width, bottom: top + height })

describe('a layer placed beside what opened it', () => {
  it('opens on its side, aligned to its start', () => {
    expect(placeBeside(rect(200, 100), { width: 240, height: 300 }, 'bottom', 'start', 6, VIEW)).toEqual({
      side: 'bottom',
      top: 138,
      left: 200,
      maxHeight: 800 - 132 - 8 - 6,
    })
  })

  it('opens on the other side where there is more room', () => {
    const place = placeBeside(rect(200, 700), { width: 240, height: 300 }, 'bottom', 'start', 6, VIEW)
    expect(place.side).toBe('top')
    expect(place.top).toBe(700 - 6 - 300)
  })

  it('stays on its side, scrolling, where the other has less room still', () => {
    const place = placeBeside(rect(200, 500), { width: 240, height: 600 }, 'bottom', 'start', 6, VIEW)
    expect(place.side).toBe('top')
    expect(place.maxHeight).toBe(500 - 8 - 6)
  })

  it('keeps within the window', () => {
    expect(placeBeside(rect(900, 100), { width: 240, height: 100 }, 'bottom', 'start', 6, VIEW).left).toBe(1000 - 240 - 8)
    expect(placeBeside(rect(900, 100), { width: 240, height: 100 }, 'bottom', 'end', 6, VIEW).left).toBe(1000 - 240 - 8)
  })

  it('opens at a point (a context menu)', () => {
    const point = { left: 300, right: 300, top: 400, bottom: 400, width: 0, height: 0 }
    expect(placeBeside(point, { width: 200, height: 160 }, 'bottom', 'start', 2, VIEW)).toMatchObject({ top: 402, left: 300 })
  })
})
