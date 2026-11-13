# AIAgentActivity

What an assistant did, step by step: each step's state in words beside its time, its input and output on demand; its notes between stretches of steps, as its words; folded under its heading when asked. Composed from its parts, or whole.

**You provide** `activities` (`[{ id, kind?, type, title, status, statusLabel?, timestamp?, duration?, details? }]`): `kind: 'note'` for its words between steps; `type` (`thinking` · `searching` · `reading` · `writing` · `tool_execution` · `api_request` · `database_query` · `code_execution` · …); `status` (`pending` · `running` · `success` · `error` · `cancelled`); `details` (`{ input, output, codeSnippet, language }`). Then `isRunning`, `title`, `agentName`, `summary`, `inputLabel`, `outputLabel`, `notesLabel`; `collapsible` with `defaultOpen` (or `open`, `onOpenChange`).

```tsx
<AIAgentActivity activities={steps} isRunning summary="2 of 3 done" inputLabel="Asked" outputLabel="Answer">
  <AgentActivityHeader title="The October summary" agentName="Assistant" />
  <AgentActivityTimeline />
</AIAgentActivity>
```

- Always give `statusLabel` ("Done", "Running"): a state is said in words, never by the icon's colour alone (green done, red failed).
- The parts: `AgentActivityHeader` (with "Expand all" and "Collapse all" unless `showControls={false}`), `AgentActivityTimeline`, `AgentActivityItem` for one step alone, `AgentActivityNotes`.
- Drawn as a panel: `surface`, `border` at 70%, `radius-2xl`; `glass-card` under glass.
