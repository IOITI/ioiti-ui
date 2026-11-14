import { AgentActivityHeader, AgentActivityTimeline, AIAgentActivity, Button } from 'ioiti-ui'
import type { AgentActivityItemData } from 'ioiti-ui'
import { useState } from 'react'

import { STEPS_AND_NOTES } from '../../../samples/ai'

/** The last step done, and the note before it finished: what the activity is once the answer is written. */
const DONE: AgentActivityItemData[] = STEPS_AND_NOTES.map((item) =>
  item.status === 'running' ? { ...item, status: 'success', statusLabel: item.kind === 'note' ? undefined : 'Done', duration: '2.1 s' } : item,
)

export default function AIAgentActivityRunning() {
  const [done, setDone] = useState(false)
  return (
    <div className="space-y-3">
      <Button size="sm" variant="outline" onClick={() => setDone(!done)}>
        {done ? 'Run it again' : 'Finish the summary'}
      </Button>
      {/* Composed from its parts: its header, then its timeline, cut by its notes. */}
      <AIAgentActivity
        activities={done ? DONE : STEPS_AND_NOTES}
        isRunning={!done}
        summary={done ? '3 of 3 done · 4 s' : '2 of 3 done'}
        inputLabel="Asked"
        outputLabel="Answer"
        notesLabel="Its notes"
      >
        <AgentActivityHeader title="The October summary" agentName="Assistant" />
        <AgentActivityTimeline />
      </AIAgentActivity>
    </div>
  )
}
