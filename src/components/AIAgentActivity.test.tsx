import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AIAgentActivity } from './ui/ai-agent-activity.js'
import type { AgentActivityItemData } from './ui/ai-agent-activity.js'

const STEPS: AgentActivityItemData[] = [
  { id: 'a', type: 'reading', title: 'Read the run', status: 'success', statusLabel: 'Done', duration: '1.2 s',
    details: { input: { run_id: 'r42' }, output: '42 trades' } },
  { id: 'b', type: 'tool_execution', title: 'Started a backtest', status: 'running', statusLabel: 'Waiting',
    description: '2nd in line' },
  { id: 'c', type: 'failed', title: 'Saved a script', status: 'error', statusLabel: 'Refused' },
]

describe('AIAgentActivity', () => {
  it('says each step in words, its state never by colour alone, and its summary once nothing runs', () => {
    const { rerender } = render(<AIAgentActivity activities={STEPS} isRunning summary="1 of 3 done" />)

    for (const label of ['Done', 'Waiting', 'Refused']) expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('2nd in line')).toBeInTheDocument()

    rerender(<AIAgentActivity activities={STEPS} summary="1 of 3 done" />)
    expect(screen.getByText('1 of 3 done')).toBeInTheDocument()
  })

  it('opens a step with details as a button, its input and output under their names', () => {
    render(<AIAgentActivity activities={STEPS} inputLabel="Asked" outputLabel="Answer" />)

    const opener = screen.getByRole('button', { name: /Read the run/ })
    expect(opener).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(opener)
    expect(opener).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Asked')).toBeInTheDocument()
    expect(screen.getByText('Answer')).toBeInTheDocument()
    expect(screen.getByText('42 trades')).toBeInTheDocument()
    expect(screen.getByText(/"run_id": "r42"/)).toBeInTheDocument()
    fireEvent.click(opener)
    expect(opener).toHaveAttribute('aria-expanded', 'false')
  })

  it('starts with the steps asked open', () => {
    render(<AIAgentActivity activities={STEPS} defaultExpandedIds={['a']} />)
    expect(screen.getByRole('button', { name: /Read the run/ })).toHaveAttribute('aria-expanded', 'true')
  })
})
