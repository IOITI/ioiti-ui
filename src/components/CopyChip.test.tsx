import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CopyChip } from './CopyChip.js'

describe('CopyChip', () => {
  it('shows its value, with a button that copies it', () => {
    render(<CopyChip value="IT-1042" label="the reference" />)
    expect(screen.getByText('IT-1042')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy the reference' })).toBeInTheDocument()
  })

  it('cuts a long value in its middle, the whole of it for a screen reader', () => {
    const { container } = render(<CopyChip value="4f1c2a7e-9b0d-4d93-a6ff-21c8e5b7a042" label="the request ID" truncate="middle" />)
    expect(container).toHaveTextContent('4f1c2a7e…b7a042')
    // Read whole, the cut shown hidden from a screen reader (its hint describes it, too).
    expect(container.querySelector('.font-mono .sr-only')).toHaveTextContent('4f1c2a7e-9b0d-4d93-a6ff-21c8e5b7a042')
    expect(screen.getByText('4f1c2a7e…b7a042')).toHaveAttribute('aria-hidden', 'true')
  })
})
