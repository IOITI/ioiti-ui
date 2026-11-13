import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { HealthStatus } from '../lib/health.js'
import { summariseStatusHistory } from '../lib/status-history.js'
import { StatusHistory } from './StatusHistory.js'

const day = (bad: Record<number, HealthStatus> = {}) =>
  Array.from({ length: 24 }, (_, hour) => ({ status: bad[hour] ?? ('ok' as HealthStatus), at: `${String(hour).padStart(2, '0')}:00` }))

describe('the uptime strip', () => {
  it('is one picture, said in words: how long it was up, and when it was not', () => {
    const { container } = render(<StatusHistory label="API, the last 24 hours" slots={day({ 14: 'warning' })} scale={['24 h ago', 'Now']} />)
    expect(screen.getByRole('img', { name: 'API, the last 24 hours: 23 hours up, 1 degraded at 14:00' })).toBeInTheDocument()
    const blocks = screen.getByRole('img').children
    expect(blocks).toHaveLength(24)
    expect(blocks[14]).toHaveClass('bg-warning')
    expect(blocks[0]).toHaveClass('bg-positive')
    expect(screen.getByText('24 h ago').parentElement).toHaveAttribute('aria-hidden')
    expect(container.querySelector('[tabindex]')).toBeNull()
  })

  it('takes a summary of its own', () => {
    render(<StatusHistory label="Queue" slots={day()} summary="Up all day" />)
    expect(screen.getByRole('img', { name: 'Queue: Up all day' })).toBeInTheDocument()
  })
})

describe('the strip in words', () => {
  it('names every state with its times, three at most', () => {
    expect(summariseStatusHistory(day({ 2: 'down', 3: 'down', 9: 'warning' }))).toBe('21 hours up, 2 down at 02:00 and 03:00, 1 degraded at 09:00')
    expect(summariseStatusHistory(day({ 1: 'down', 2: 'down', 3: 'down', 4: 'down', 5: 'down' }))).toBe(
      '19 hours up, 5 down at 01:00, 02:00, 03:00 and 2 more',
    )
  })

  it('counts in the unit given, its states in one order (the worst first), when it was never up too', () => {
    const days = [
      { status: 'unknown' as const, at: 'Mon' },
      { status: 'down' as const, at: 'Tue' },
    ]
    expect(summariseStatusHistory(days, { one: 'day', other: 'days' })).toBe('1 day down at Tue, 1 day unknown at Mon')
    expect(summariseStatusHistory([{ status: 'ok', at: 'Mon' }], { one: 'day', other: 'days' })).toBe('1 day up')
    expect(summariseStatusHistory([])).toBe('No history yet')
  })
})
