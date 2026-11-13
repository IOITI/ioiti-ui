# AIResponse

An assistant's answer: Markdown read as it streams (never as HTML), its sources, and copy, regenerate and feedback under it.

**You provide** `content` (Markdown), `status` (`idle` · `generating` · `streaming` · `complete` · `error` · `cancelled`), `modelName`; `sources` (`[{ id, title, url?, snippet? }]`); `onRegenerate`, `onFeedback` with `feedback` given before; `thinking` (`{ label, lines?, since? }`) for what it does while nothing is written. Or compose it from `AIResponseHeader`, `AIResponseContent`, `AIResponseToolsSummary`, `AIResponseSources`, `AIResponseActions`.

```tsx
<AIResponse content={answer} status={done ? 'complete' : 'streaming'} modelName="Model 2"
  sources={sources} onRegenerate={ask} onFeedback={(type) => send(type)} />
```

- A same-site link is the application's (`LinkProvider`); any other opens a new tab; a dangerous one (`javascript:`) is no link at all.
- Unfinished code fences and lists render as they stream. Copy, regenerate and feedback wait for its first word.
- Drawn on `surface` with a hairline `border`; `glass-card` under glass. The request is a `PromptComposer`; the steps taken, `AIAgentActivity`.
