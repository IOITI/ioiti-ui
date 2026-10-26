import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { SignedValue } from './status.js'

// Motion reads the preference once per page: in a file of its own, before anything renders.
beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  )
})

describe('a rolling signed value where motion is reduced', () => {
  it('is the value as plain text', () => {
    const { container } = render(<SignedValue value={1.25} kind="percent" animate />)

    expect(screen.getByText('+1.25%')).not.toHaveClass('sr-only')
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
