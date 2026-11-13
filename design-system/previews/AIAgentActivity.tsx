import { AgentActivityHeader, AgentActivityItem, AgentActivityTimeline, AIAgentActivity } from 'ioiti-ui'
import type { AgentActivityItemData } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const ACTIVITY: AgentActivityItemData[] = [
  { id: 'a1', type: 'thinking', title: 'Read the question', status: 'success', statusLabel: 'Done', duration: '0.4 s', timestamp: '09:31:02' },
  { id: 'a2', type: 'database_query', title: 'Orders of October', status: 'success', statusLabel: 'Done', duration: '1.2 s', timestamp: '09:31:03', details: { input: { month: '2026-10' }, output: '42 orders' } },
  { id: 'a3', type: 'writing', title: 'The summary', status: 'running', statusLabel: 'Running', timestamp: '09:31:05' },
]

// What the assistant said between its steps: its notes cut the timeline, a stretch of steps after each.
const TALK: AgentActivityItemData[] = [
  { id: 'n1', kind: 'note', type: 'thinking', title: 'I read the question, then the orders it names, before I write anything.', status: 'success', timestamp: '09:31:01' },
  ACTIVITY[0],
  ACTIVITY[1],
  { id: 'n2', kind: 'note', type: 'thinking', title: 'October has 42 orders, three of them late, all from the same shop.', status: 'success', timestamp: '09:31:04' },
  { id: 'n3', kind: 'note', type: 'thinking', title: 'I put the late ones first, then the rest in three lines', status: 'running' },
  ACTIVITY[2],
]

createRoot(document.getElementById('root')!).render(
  <div className="block w-full p-5">
    <AIAgentActivity activities={TALK} isRunning summary="2 of 3 done" inputLabel="Asked" outputLabel="Answer" notesLabel="Its notes">
      <AgentActivityHeader title="The October summary" agentName="Assistant" />
      <AgentActivityTimeline />
    </AIAgentActivity>
    <AIAgentActivity
      className="mt-4"
      activities={TALK.slice(0, 4)}
      collapsible
      defaultOpen={false}
      title="An earlier question"
      agentName="Assistant"
      summary="2 tool calls · 2 notes · 4 s"
    />
    <div className="mt-4 rounded-2xl border border-border/70">
      <AIAgentActivity activities={ACTIVITY.slice(0, 1)}>
        {/* An item alone has no timeline around it: the timeline's padding, given here. */}
        <AgentActivityItem activity={ACTIVITY[0]} isLast className="px-8 pt-5" />
      </AIAgentActivity>
    </div>
  </div>,
)
