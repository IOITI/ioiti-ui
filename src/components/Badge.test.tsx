import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Alert } from './ui/alert.js'
import { Badge } from './ui/badge.js'

/** A badge's frame, around the word it rolls in. */
const badge = (word: string) => screen.getByText(word).closest('.font-sans')

describe("Badge's tones", () => {
  it('are a state’s (StatusTone): info too, drawn as Alert draws it, in each variant', () => {
    render(
      <>
        <Badge tone="info">Imported</Badge>
        <Badge tone="info" variant="solid">
          New
        </Badge>
        <Badge tone="info" variant="outline" dot>
          Synced
        </Badge>
        <Alert tone="info">Prices are updated every night.</Alert>
      </>,
    )
    // Its faint ground and its word: Alert's box.
    expect(badge('Imported')).toHaveClass('bg-info/5', 'text-info')
    expect(screen.getByRole('status')).toHaveClass('bg-info/5', 'text-info', 'border-info/30')
    expect(badge('New')).toHaveClass('bg-info', 'text-background')
    expect(badge('Synced')).toHaveClass('border-info/30', 'text-info')
    expect(badge('Synced')?.querySelector('.rounded-full.bg-info')).not.toBeNull()
  })

  it('keep the others as they were: danger in the negative colour, success in the positive', () => {
    render(
      <>
        <Badge tone="danger">Overdue</Badge>
        <Badge tone="success">Paid</Badge>
        <Badge>Draft</Badge>
      </>,
    )
    expect(badge('Overdue')).toHaveClass('bg-negative/5', 'text-negative')
    expect(badge('Paid')).toHaveClass('bg-positive/5', 'text-positive')
    expect(badge('Draft')).toHaveClass('bg-muted', 'text-text-secondary')
  })
})
