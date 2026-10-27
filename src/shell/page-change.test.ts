import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { usePageChanged } from './page-change.js'

describe('a change of page', () => {
  it('is none for the page first shown', () => {
    const { result } = renderHook(() => usePageChanged('/orders'))

    expect(result.current).toBe(false)
  })

  it('is the render that shows another address, and that one only', () => {
    const { result, rerender } = renderHook(({ pathname }) => usePageChanged(pathname), { initialProps: { pathname: '/orders' } })

    rerender({ pathname: '/settings' })
    expect(result.current).toBe(true)

    // The same page drawn again (its query, its own state): no change of page.
    rerender({ pathname: '/settings' })
    expect(result.current).toBe(false)
  })
})
