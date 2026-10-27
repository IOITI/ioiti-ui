import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LiveValue } from './LiveValue.js'

describe('LiveValue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a change in its tone a moment, then fades back', () => {
    vi.useFakeTimers()
    const { rerender } = render(<LiveValue value={18_120.5} />)
    const figure = screen.getByText('18,120.50')
    expect(figure).not.toHaveClass('text-positive')

    rerender(<LiveValue value={18_124.25} />)
    expect(screen.getByText('18,124.25')).toHaveClass('text-positive')
    act(() => {
      vi.advanceTimersByTime(700)
    })
    expect(screen.getByText('18,124.25')).not.toHaveClass('text-positive')
    expect(screen.getByText('18,124.25')).toHaveClass('transition-colors')

    rerender(<LiveValue value={18_100} />)
    expect(screen.getByText('18,100')).toHaveClass('text-negative')
  })

  it('swaps its tones where down is good', () => {
    const { rerender } = render(<LiveValue value={240} invert />)
    rerender(<LiveValue value={180} invert />)
    expect(screen.getByText('180')).toHaveClass('text-positive')
  })

  it('is muted, and said stale, when what sends it stopped', () => {
    render(<LiveValue value={42} stale />)
    const figure = screen.getByText('42', { exact: false })
    expect(figure).toHaveClass('text-text-muted')
    expect(figure).toHaveTextContent('42 (stale)')
  })
})
