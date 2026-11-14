import { AgentActivityItem, AgentActivityNotes, AIAgentActivity } from 'ioiti-ui'

import { STEPS, STEPS_AND_NOTES } from '../../../samples/ai'

export default function AIAgentActivityParts() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {/* A timeline laid out by the page: a note, then the steps it chose, the second open. */}
      <AIAgentActivity activities={STEPS_AND_NOTES} inputLabel="Asked" outputLabel="Answer" notesLabel="Its notes" defaultExpandedIds={['a2']}>
        <div className="space-y-2 px-4 py-4 sm:px-8 sm:py-7">
          <AgentActivityNotes notes={STEPS_AND_NOTES.slice(0, 1)} />
          <AgentActivityItem activity={STEPS[0]} />
          <AgentActivityItem activity={STEPS[1]} isLast />
        </div>
      </AIAgentActivity>
      {/* One step alone. */}
      <AIAgentActivity activities={STEPS.slice(2)}>
        <div className="px-4 py-4 sm:px-8 sm:py-7">
          <AgentActivityItem activity={STEPS[2]} isLast />
        </div>
      </AIAgentActivity>
    </div>
  )
}
