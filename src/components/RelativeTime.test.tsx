import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RelativeTime } from './RelativeTime.js'

describe('RelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-27T14:00:00Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('says a moment from now, kept true as time goes by', () => {
    render(<RelativeTime value="2026-10-27T13:59:50Z" timeZone="Europe/Paris" />)
    const time = screen.getByText(/ago/)
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('dateTime', '2026-10-27T13:59:50.000Z')
    expect(time).toHaveTextContent('10 s ago')

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(time).toHaveTextContent('15 s ago')
  })

  it('gives its full date to a screen reader', () => {
    render(<RelativeTime value={new Date('2026-10-27T11:00:00Z')} timeZone="Europe/Paris" />)
    expect(screen.getByText(/ago/)).toHaveTextContent('3 h 00 ago, 27 Oct, 12:00:00')
  })
})
