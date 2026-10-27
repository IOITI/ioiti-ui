import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useNow } from './now.js'

function Clock({ interval, id }: { interval?: number; id: string }) {
  const now = useNow(interval)
  return <output data-testid={id}>{now}</output>
}

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-27T10:00:00Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('reads the time again at each interval', () => {
    render(<Clock id="clock" />)
    const start = Number(screen.getByTestId('clock').textContent)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(Number(screen.getByTestId('clock').textContent)).toBe(start + 1000)
  })

  it('shares one timer between the clocks of one interval, and stops it when none is left', () => {
    const started = vi.spyOn(globalThis, 'setInterval')
    const stopped = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = render(
      <>
        <Clock id="a" interval={60_000} />
        <Clock id="b" interval={60_000} />
      </>,
    )
    expect(started.mock.calls.filter(([, ms]) => ms === 60_000)).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByTestId('a').textContent).toBe(screen.getByTestId('b').textContent)

    unmount()
    expect(stopped).toHaveBeenCalled()
  })

  it('reads the time again when the clock was set back while nothing read it', () => {
    const { unmount } = render(<Clock id="clock" interval={5000} />)
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    unmount()

    vi.setSystemTime(new Date('2026-10-27T10:00:00Z'))
    render(<Clock id="again" interval={5000} />)
    expect(Number(screen.getByTestId('again').textContent)).toBe(Date.parse('2026-10-27T10:00:00Z'))
  })
})
