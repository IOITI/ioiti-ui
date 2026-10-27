import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ChartLegend } from './ChartLegend.js'

const ITEMS = [
  { label: 'Run 41', color: 'var(--chart-compare-1)', shape: 'line' as const, value: '+4.2%' },
  { label: 'Run 42', color: 'var(--chart-compare-2)', shape: 'dashed' as const, shown: false },
]

describe('ChartLegend', () => {
  it('lists what the colours stand for', () => {
    render(<ChartLegend label="Runs" items={ITEMS} />)
    const legend = screen.getByRole('list', { name: 'Runs' })
    expect(legend).toHaveTextContent('Run 41 +4.2%')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows or hides a series, each item a button saying whether it is shown', async () => {
    const user = userEvent.setup()
    const toggled = vi.fn()
    render(<ChartLegend items={ITEMS} onToggle={toggled} />)

    expect(screen.getByRole('button', { name: 'Run 41 +4.2%' })).toHaveAttribute('aria-pressed', 'true')
    const hidden = screen.getByRole('button', { name: 'Run 42' })
    expect(hidden).toHaveAttribute('aria-pressed', 'false')

    await user.click(hidden)
    expect(toggled).toHaveBeenCalledWith(1)
  })
})
