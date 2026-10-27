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
    const { container } = render(<CopyChip value="whsec_4f9a2c7e1b0d93a6ff21" label="the secret" truncate="middle" />)
    expect(container).toHaveTextContent('whsec_4f…a6ff21')
    // Read whole, the cut shown hidden from a screen reader (its hint describes it, too).
    expect(container.querySelector('.font-mono .sr-only')).toHaveTextContent('whsec_4f9a2c7e1b0d93a6ff21')
    expect(screen.getByText('whsec_4f…a6ff21')).toHaveAttribute('aria-hidden', 'true')
  })
})
