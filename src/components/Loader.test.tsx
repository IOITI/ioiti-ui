import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Loader } from './ui/loader.js'

describe('Loader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows nothing before its delay: a short wait draws no spinner', () => {
    render(<Loader delay={300} label="Loading the page" />)
    expect(screen.queryByRole('status')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByRole('status', { name: 'Loading the page' })).toBeInTheDocument()
  })

  it('shows at once without one', () => {
    render(<Loader />)
    expect(screen.getByRole('status', { name: 'Loading…' })).toBeInTheDocument()
  })
})
