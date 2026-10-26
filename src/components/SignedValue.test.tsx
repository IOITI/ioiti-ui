import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SignedValue } from './status.js'

describe('a signed value that rolls to each new value', () => {
  it('is read as the value it shows, its rolling digits hidden from screen readers', () => {
    const { container, rerender } = render(<SignedValue value={12.4} kind="money" animate />)

    const read = screen.getByText('+€12.40')
    expect(read).toHaveClass('sr-only')
    expect(read.parentElement).toHaveClass('text-positive')
    const shown = container.querySelector('[aria-hidden="true"]') as HTMLElement
    // A column of digits for each digit; the sign, the euro and the point as they are.
    expect(shown.children).toHaveLength(7)

    rerender(<SignedValue value={-3.5} kind="money" animate />)
    expect(screen.getByText('−€3.50').parentElement).toHaveClass('text-negative')
  })

  it('is plain text when there is no value', () => {
    const { container } = render(<SignedValue value={null} kind="percent" animate />)

    expect(screen.getByText('—')).not.toHaveClass('sr-only')
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
