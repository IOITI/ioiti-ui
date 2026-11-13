# InteractiveTimeline

What happened to something, step by step, with its moments and figures: an order placed, paid, packed and sent; a release built and deployed.

**You provide** `items` (`[{ id, title, timestamp, status, statusLabel?, description?, metrics?, author?, tag?, commitHash? }]`), `status` being `completed` · `in-progress` · `pending` · `failed` · `warning`; `label` (whose steps they are, for a screen reader); `defaultExpandedIds`, `defaultSelectedId`, `onItemSelect`; `collapsible` (on by default).

```tsx
<InteractiveTimeline label="Order 2026-0042" defaultExpandedIds={['packed']} items={[
  { id: 'paid', title: 'Paid', timestamp: '26 Oct, 09:13', status: 'completed', metrics: [{ label: 'Amount', value: '1,840.00 €' }] },
  { id: 'packed', title: 'Being packed', timestamp: '26 Oct, 10:40', status: 'in-progress', statusLabel: 'Now', description: 'Three boxes.' },
]} />
```

- A step opens on its description, figures and author; one with only a title and a time has nothing to open. A badge shows only with `statusLabel`.
- What is done and under way is blue, the accent's `brand` where one is chosen; a failed step red, a warning amber; the line fills down to the step under way.
- For a version history to restore from, use `RecoveryLedger`; for an assistant's steps, `AIAgentActivity`.
