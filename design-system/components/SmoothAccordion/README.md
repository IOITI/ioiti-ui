# SmoothAccordion

Questions and their answers, opened one at a time or several: an answer eases open under its question, and the chevron turns.

**You provide** `items` (`[{ id, title, subtitle?, content }]`); `defaultOpen` (the ids open at first), `allowMultiple` (several open at once; one at a time by default).

```tsx
<SmoothAccordion defaultOpen={['returns']} items={[
  { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
  { id: 'invoice', title: 'Where is the invoice?', subtitle: "In every order's page", content: 'Under Documents, as a PDF.' },
]} />
```

- Each question is a button (`aria-expanded`): Tab moves between them, Enter or Space opens and closes.
- One box, hairlines between its items, a `subtitle` in `muted-foreground`; `glass-card` under glass.
- A single "more" under a figure or a table is a `Disclosure` (the browser's `<details>`, which find in the page opens). Views of one thing, one shown at a time: `AnimatedTabs`.
