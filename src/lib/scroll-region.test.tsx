import { act, render, screen, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useScrollRegion } from './scroll-region.js'
import type { ScrollRegionOptions } from './scroll-region.js'

function Frame({ children, ...options }: ScrollRegionOptions & { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const region = useScrollRegion(ref, options)
  return (
    <div ref={ref} data-testid="frame" {...region}>
      {children}
    </div>
  )
}

// jsdom lays nothing out: the frame shows 400 × 200 px, and holds what the test says.
let held = { width: 400, height: 200 }
const size = (frame: number, other = 0) =>
  function (this: Element) {
    return this.getAttribute('data-testid') === 'frame' ? frame : other
  }

beforeEach(() => {
  held = { width: 400, height: 200 }
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(size(400))
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(size(200))
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
    return size(held.width).call(this)
  })
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return size(held.height).call(this)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('a region that scrolls', () => {
  it('is a stop of the keyboard while what it holds is wider than what it shows, a region named by what it holds', () => {
    held = { width: 900, height: 200 }
    render(<Frame label="Latest orders">A line too long for its frame</Frame>)

    const frame = screen.getByRole('region', { name: 'Latest orders' })
    expect(frame).toBe(screen.getByTestId('frame'))
    expect(frame).toHaveAttribute('tabindex', '0')
  })

  it('is one too while what it holds is taller than what it shows', () => {
    held = { width: 400, height: 1200 }
    render(<Frame label="Code">Many lines</Frame>)

    expect(screen.getByRole('region', { name: 'Code' })).toHaveAttribute('tabindex', '0')
  })

  it('is no stop while all it holds is in sight: no tab index, no role, no name', () => {
    render(<Frame label="Latest orders">A short line</Frame>)

    const frame = screen.getByTestId('frame')
    expect(frame).not.toHaveAttribute('tabindex')
    expect(frame).not.toHaveAttribute('role')
    expect(frame).not.toHaveAttribute('aria-label')
  })

  it('is no stop while it holds a control: Tab reaches the control, and the arrows scroll what holds it', () => {
    held = { width: 900, height: 200 }
    render(
      <Frame label="Latest orders">
        <a href="/orders/1042">Order 1042</a>
      </Frame>,
    )

    expect(screen.getByTestId('frame')).not.toHaveAttribute('tabindex')
  })

  it('counts no control out of the tab order, nor a disabled one', () => {
    held = { width: 900, height: 200 }
    render(
      <Frame label="Latest orders">
        <button type="button" disabled>
          Cancel
        </button>
        <span tabIndex={-1}>Order 1042</span>
      </Frame>,
    )

    expect(screen.getByRole('region', { name: 'Latest orders' })).toHaveAttribute('tabindex', '0')
  })

  it('is named by what names it, given, before a label', () => {
    held = { width: 900, height: 200 }
    render(
      <>
        <h2 id="orders-heading">Open orders</h2>
        <Frame label="Table" labelledBy="orders-heading">
          A line too long for its frame
        </Frame>
      </>,
    )

    const frame = screen.getByRole('region', { name: 'Open orders' })
    expect(frame).toHaveAttribute('aria-labelledby', 'orders-heading')
    expect(frame).not.toHaveAttribute('aria-label')
  })

  it('is a stop without a role of its own where it is a landmark already', () => {
    held = { width: 400, height: 1200 }
    render(<Frame region={false}>A page of text</Frame>)

    const frame = screen.getByTestId('frame')
    expect(frame).toHaveAttribute('tabindex', '0')
    expect(frame).not.toHaveAttribute('role')
    expect(frame).not.toHaveAttribute('aria-label')
  })
})

describe('a region watched', () => {
  // The ResizeObserver is one the test calls: the window, a font arriving, rows added.
  let resized: (() => void)[] = []
  beforeEach(() => {
    resized = []
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resized.push(callback)
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
  })
  const resize = (width: number) => {
    held = { width, height: 200 }
    act(() => {
      for (const callback of resized) callback()
    })
  }

  it('becomes a stop once what it holds no longer fits, and is none again once it does', () => {
    render(<Frame label="Latest orders">A line</Frame>)
    const frame = screen.getByTestId('frame')
    expect(frame).not.toHaveAttribute('tabindex')

    resize(900)
    expect(frame).toHaveAttribute('tabindex', '0')
    expect(frame).toHaveAttribute('role', 'region')

    resize(400)
    expect(frame).not.toHaveAttribute('tabindex')
    expect(frame).not.toHaveAttribute('role')
  })

  it('is no longer a stop once a control arrives in it, and is one again once it goes', async () => {
    held = { width: 900, height: 200 }
    const { rerender } = render(<Frame label="Latest orders">A line too long for its frame</Frame>)
    const frame = screen.getByTestId('frame')
    expect(frame).toHaveAttribute('tabindex', '0')

    rerender(
      <Frame label="Latest orders">
        A line too long for its frame <a href="/orders">All orders</a>
      </Frame>,
    )
    await waitFor(() => expect(frame).not.toHaveAttribute('tabindex'))

    rerender(<Frame label="Latest orders">A line too long for its frame</Frame>)
    await waitFor(() => expect(frame).toHaveAttribute('tabindex', '0'))
  })
})
