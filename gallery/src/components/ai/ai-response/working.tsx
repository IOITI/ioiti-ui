import { AIResponse, AIResponseActions, AIResponseContent, AIResponseHeader, AIResponseThinking } from 'ioiti-ui'
import { useState } from 'react'

const WORKING = [
  'October: 42 orders read',
  'September: 31 of 38 read',
  'October has three late orders, all from the same shop.',
  '4 tool calls so far',
]

export default function AIResponseWorking() {
  // As if asked six minutes ago.
  const [since] = useState(() => Date.now() - 372_000)
  return (
    <div className="space-y-4">
      {/* Nothing of its answer written yet: what it does, for how long, and what it is about, a line at a time. */}
      <AIResponse status="generating" thinking={{ label: 'Comparing October with September', lines: WORKING, since }}>
        <AIResponseHeader title="Assistant" modelBadge="Model 2" />
        <AIResponseContent />
        <AIResponseActions />
      </AIResponse>
      {/* Alone, where a page draws its own answer. */}
      <div className="rounded-2xl border border-border/70 px-4">
        <AIResponseThinking label="Thinking" lines={['Reading the question', 'Planning its first steps']} />
      </div>
    </div>
  )
}
