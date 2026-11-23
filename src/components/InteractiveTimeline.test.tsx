import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InteractiveTimeline } from './ui/interactive-timeline.js'
import type { TimelineItem } from './ui/interactive-timeline.js'

const STEPS: TimelineItem[] = [
  { id: 'build', title: 'Built', timestamp: '14:02', status: 'completed', statusLabel: 'Done' },
  { id: 'tests', title: 'Tested', timestamp: '14:05', status: 'warning', statusLabel: 'Slow' },
  { id: 'deploy', title: 'Deployed', timestamp: '14:13', status: 'failed', statusLabel: 'Failed' },
  { id: 'retry', title: 'Deploying again', timestamp: '14:20', status: 'in-progress', statusLabel: 'Now' },
  { id: 'everywhere', title: 'Deployed everywhere', timestamp: '—', status: 'pending' },
]

describe('InteractiveTimeline', () => {
  it('hides the line behind every node: each one is on the surface, a tint painted over it', () => {
    render(<InteractiveTimeline label="Release 4.2" items={STEPS} />)

    for (const name of ['Built: Done', 'Tested: Slow', 'Deployed: Failed', 'Deploying again: Now']) {
      expect(screen.getByRole('button', { name })).toHaveClass('bg-surface')
    }
    // A tint alone (bg-negative/5) let the line show across the icon.
    expect(screen.getByRole('button', { name: 'Tested: Slow' })).toHaveClass('bg-linear-to-b', 'from-warning/5')
    expect(screen.getByRole('button', { name: 'Deployed: Failed' })).toHaveClass('bg-linear-to-b', 'from-negative/5')
    expect(screen.getByRole('button', { name: 'Deployed everywhere: pending' })).toHaveClass('bg-surface')
  })
})
