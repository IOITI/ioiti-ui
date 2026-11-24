import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useControllableState } from './controllable.js'

describe('useControllableState', () => {
  it('holds the value itself from its default, onChange told of each change', () => {
    const changed = vi.fn()
    const { result } = renderHook(() => useControllableState<string>(undefined, 'day', changed))
    expect(result.current[0]).toBe('day')

    act(() => result.current[1]('week'))
    expect(result.current[0]).toBe('week')
    expect(changed).toHaveBeenCalledWith('week')
  })

  it('leaves the value to its caller when one is given, onChange told and nothing changed until the caller says so', () => {
    const changed = vi.fn()
    const { result, rerender } = renderHook(({ value }) => useControllableState<string>(value, 'day', changed), {
      initialProps: { value: 'month' },
    })
    act(() => result.current[1]('week'))
    expect(changed).toHaveBeenCalledWith('week')
    expect(result.current[0]).toBe('month')

    rerender({ value: 'week' })
    expect(result.current[0]).toBe('week')
  })

  it('passes on what goes with a change (why a sheet closed)', () => {
    const changed = vi.fn<(open: boolean, details?: { reason: string }) => void>()
    const { result } = renderHook(() => useControllableState<boolean, [details?: { reason: string }]>(undefined, true, changed))
    act(() => result.current[1](false, { reason: 'escape' }))
    expect(result.current[0]).toBe(false)
    expect(changed).toHaveBeenCalledWith(false, { reason: 'escape' })
  })

  it('tells the latest onChange, its setter the same from one render to the next', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(({ onChange }) => useControllableState<number>(undefined, 0, onChange), {
      initialProps: { onChange: first },
    })
    const set = result.current[1]
    rerender({ onChange: second })
    expect(result.current[1]).toBe(set)

    act(() => result.current[1](1))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith(1)
  })
})
