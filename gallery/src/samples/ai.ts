// The AI category's sample data: an assistant's steps, its notes between them, an answer and its sources.

import type { AgentActivityItemData, AIResponseSource } from 'ioiti-ui'

/** Three steps of an assistant summarising October's orders, the last one under way. */
export const STEPS: AgentActivityItemData[] = [
  { id: 'a1', type: 'thinking', title: 'Read the question', status: 'success', statusLabel: 'Done', duration: '0.4 s', timestamp: '09:31:02' },
  {
    id: 'a2',
    type: 'database_query',
    title: 'Orders of October',
    status: 'success',
    statusLabel: 'Done',
    duration: '1.2 s',
    timestamp: '09:31:03',
    details: { input: { month: '2026-10' }, output: '42 orders' },
  },
  { id: 'a3', type: 'writing', title: 'The summary', status: 'running', statusLabel: 'Running', timestamp: '09:31:05' },
]

/** What the assistant said between its steps: its notes cut the timeline, a stretch of steps after each. */
export const STEPS_AND_NOTES: AgentActivityItemData[] = [
  { id: 'n1', kind: 'note', type: 'thinking', title: 'I read the question, then the orders it names, before I write anything.', status: 'success', timestamp: '09:31:01' },
  STEPS[0],
  STEPS[1],
  { id: 'n2', kind: 'note', type: 'thinking', title: 'October has 42 orders, three of them late, all from the same shop.', status: 'success', timestamp: '09:31:04' },
  { id: 'n3', kind: 'note', type: 'thinking', title: 'I put the late ones first, then the rest in three lines', status: 'running' },
  STEPS[2],
]

/** An answer in Markdown: a heading, a table, a list, a block of code, and links (one the application's). */
export const ANSWER = `## October, in short

October had **42 orders from 31 customers**, 3 of them late; see [what the assistant did](/components/ai/ai-agent-activity)
and [the guide](https://example.com/guide).

| Check | Result |
| --- | --- |
| Orders | 42 |
| Delivered on time | 93 % |

- Call the shop the late ones came from
- Try \`free_from = 50\` in November

\`\`\`json
{"free_from": 50, "carriers": ["post", "courier"]}
\`\`\``

/** Where the answer comes from: a page of the application, and a page elsewhere. */
export const SOURCES: AIResponseSource[] = [
  { id: 1, title: 'The October summary', url: '/components/ai/ai-agent-activity', snippet: 'Its figures, step by step' },
  { id: 2, title: 'A guide', url: 'https://example.com/guide' },
]
