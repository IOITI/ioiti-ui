import { AIAgentActivity } from 'ioiti-ui'
import type { AgentActivityItemData } from 'ioiti-ui'

// An earlier question's steps, all done but one that failed: its input and output open on demand.
const EARLIER: AgentActivityItemData[] = [
  { id: 'e1', kind: 'note', type: 'thinking', title: 'I look for the refunds of September, then compare them with October’s.', status: 'success', timestamp: '08:12:40' },
  {
    id: 'e2',
    type: 'database_query',
    title: 'Refunds of September',
    status: 'success',
    statusLabel: 'Done',
    duration: '0.8 s',
    timestamp: '08:12:41',
    details: { input: { month: '2026-09', kind: 'refund' }, output: '7 refunds, 412.50 €' },
  },
  {
    id: 'e3',
    type: 'api_request',
    title: 'Refunds of the payment service',
    status: 'error',
    statusLabel: 'Failed',
    duration: '5.0 s',
    timestamp: '08:12:42',
    details: { input: 'GET /refunds?month=2026-09', output: 'Timed out after 5 s' },
  },
  {
    id: 'e4',
    type: 'code_execution',
    title: 'Compared the two months',
    status: 'success',
    statusLabel: 'Done',
    duration: '0.3 s',
    timestamp: '08:12:48',
    details: { codeSnippet: 'october.refunds - september.refunds  # 2', language: 'python' },
  },
]

export default function AIAgentActivityFolded() {
  return (
    <div className="space-y-4">
      {/* Whole, from its props: folded under its heading, opened by it. */}
      <AIAgentActivity
        activities={EARLIER}
        collapsible
        defaultOpen={false}
        title="An earlier question"
        agentName="Assistant"
        summary="3 tool calls · 1 failed · 6 s"
        inputLabel="Request"
        outputLabel="Result"
      />
      {/* Open, the failed step expanded at first. */}
      <AIAgentActivity
        activities={EARLIER}
        collapsible
        title="The same, open"
        agentName="Assistant"
        summary="3 tool calls · 1 failed · 6 s"
        inputLabel="Request"
        outputLabel="Result"
        defaultExpandedIds={['e3']}
      />
    </div>
  )
}
