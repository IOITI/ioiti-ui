import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AIAgentActivity } from './ui/ai-agent-activity.js'
import type { AgentActivityItemData } from './ui/ai-agent-activity.js'

const STEPS: AgentActivityItemData[] = [
  { id: 'a', type: 'reading', title: 'Read the run', status: 'success', statusLabel: 'Done', duration: '1.2 s',
    details: { input: { run_id: 'r42' }, output: '42 trades' } },
  { id: 'b', type: 'tool_execution', title: 'Started a backtest', status: 'running', statusLabel: 'Waiting',
    description: '2nd in line' },
  { id: 'c', type: 'failed', title: 'Saved a script', status: 'error', statusLabel: 'Refused' },
]

// What an agent said between its steps, and a note still being written.
const TALK: AgentActivityItemData[] = [
  { id: 'n1', kind: 'note', type: 'thinking', title: 'I read the run first.', status: 'success', timestamp: '09:31:01' },
  { id: 'a', type: 'reading', title: 'Read the run', status: 'success', statusLabel: 'Done' },
  { id: 'b', type: 'reading', title: 'Read its days', status: 'success', statusLabel: 'Done' },
  { id: 'n2', kind: 'note', type: 'thinking', title: 'Its edge is thin.', status: 'success', timestamp: '09:31:04' },
  { id: 'n3', kind: 'note', type: 'thinking', title: 'I stress it next', status: 'running' },
  { id: 'c', type: 'tool_execution', title: 'Stress-tested the run', status: 'running', statusLabel: 'Running' },
]

/** A step's own block: its mark, its line to the next step, its title. */
const step = (title: string) => screen.getByText(title).closest('.group')!

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

  it('draws notes as its words between stretches of steps, together, whole, never as steps', () => {
    render(<AIAgentActivity activities={TALK} notesLabel="Its notes" />)

    const groups = screen.getAllByRole('group', { name: 'Its notes' })
    expect(groups).toHaveLength(2)
    expect(groups[0]).toHaveTextContent('I read the run first.')
    expect(within(groups[0]).getByText('09:31:01')).toBeInTheDocument()
    // Two notes in a row are one group, the one still written ending with a caret.
    expect(groups[1].querySelectorAll('p')).toHaveLength(2)
    expect(groups[1]).toHaveAttribute('aria-busy', 'true')
    expect(groups[1].querySelector('[data-caret]')).not.toBeNull()
    expect(screen.getByText('Its edge is thin.')).toHaveClass('whitespace-pre-line', 'break-words')
    expect(screen.getByText('Its edge is thin.')).not.toHaveClass('truncate')
    // A note has no state of its own: the steps alone say theirs, and are counted.
    expect(screen.getAllByText('Done')).toHaveLength(2)
    expect(screen.getByText('2 of 3 completed')).toBeInTheDocument()
  })

  it('cuts its line where notes come: a step after them begins a stretch of its own', () => {
    render(<AIAgentActivity activities={TALK} />)

    expect(step('Read the run').parentElement).toBe(step('Read its days').parentElement)
    expect(step('Stress-tested the run').parentElement).not.toBe(step('Read the run').parentElement)
    // The line runs from a step to the next of its stretch, and stops at its last.
    expect(step('Read the run').querySelector('.w-px')).not.toBeNull()
    expect(step('Read its days').querySelector('.w-px')).toBeNull()
    expect(step('Stress-tested the run').querySelector('.w-px')).toBeNull()
  })

  it('folds its steps under its heading, which opens them again, its controls only while open', async () => {
    render(<AIAgentActivity activities={STEPS} collapsible defaultOpen={false} title="What it did" summary="3 tool calls" />)

    const opener = screen.getByRole('button', { name: /What it did/ })
    expect(screen.getByRole('heading', { name: /What it did/ })).toContainElement(opener)
    expect(opener).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('3 tool calls')).toBeInTheDocument()
    expect(screen.queryByText('Read the run')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Expand all' })).toBeNull()

    fireEvent.click(opener)
    expect(opener).toHaveAttribute('aria-expanded', 'true')
    expect(opener).toHaveAttribute('aria-controls', document.getElementById(opener.getAttribute('aria-controls')!)!.id)
    expect(screen.getByText('Read the run')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument()

    fireEvent.click(opener)
    await waitFor(() => expect(screen.queryByText('Read the run')).toBeNull())
  })

  it('is held open or folded by its caller, told of each click', () => {
    const told = vi.fn()
    const { rerender } = render(<AIAgentActivity activities={STEPS} collapsible open onOpenChange={told} />)

    fireEvent.click(screen.getByRole('button', { name: /Activity/ }))
    expect(told).toHaveBeenCalledWith(false)
    expect(screen.getByText('Read the run')).toBeInTheDocument()

    rerender(<AIAgentActivity activities={STEPS} collapsible open={false} onOpenChange={told} />)
    expect(screen.getByRole('button', { name: /Activity/ })).toHaveAttribute('aria-expanded', 'false')
  })

  it('is no button where it does not fold', () => {
    render(<AIAgentActivity activities={STEPS} title="What it did" />)

    expect(screen.getByRole('heading', { name: 'What it did' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /What it did/ })).toBeNull()
  })
})
