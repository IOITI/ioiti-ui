import { AIResponse, AIResponseActions, AIResponseContent, AIResponseHeader, AIResponseSources, AIResponseToolsSummary } from 'ioiti-ui'
import { useState } from 'react'

import { SOURCES } from '../../../samples/ai'

export default function AIResponseParts() {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>('like')
  return (
    <AIResponse
      content="It **holds**: three orders were late, all from the same shop; see [what was done](/components/ai/ai-agent-activity)."
      sources={SOURCES}
      feedback={feedback}
      onFeedback={(type) => setFeedback((was) => (was === type ? null : type))}
    >
      {/* In the order the page needs: here the tools before the sources, the sources open. */}
      <AIResponseHeader title="Assistant" modelBadge="Model 2" timestamp="09:31" />
      <AIResponseContent />
      <AIResponseToolsSummary
        toolCount={3}
        tools={[
          { name: 'orders_of', status: 'success', duration: '1.2 s' },
          { name: 'summary', status: 'running' },
          { name: 'refunds_of', status: 'error' },
        ]}
      />
      <AIResponseSources defaultExpanded />
      <AIResponseActions />
    </AIResponse>
  )
}
