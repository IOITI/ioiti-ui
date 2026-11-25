# Accordion

Questions and their answers, opened one at a time or several: an answer eases open under its question, and the chevron turns.

**You provide** `items` (`[{ id, title, subtitle?, content }]`); `defaultValue` (the ids open at first; formerly `defaultOpen`), or `value` with `onChange` (the ids open, at each change), `allowMultiple` (several open at once; one at a time by default); `headingLevel` (`2`…`6`: each question in a heading of that level, for a page whose outline they belong to; none by default, drawn the same either way).

```tsx
<Accordion defaultValue={['returns']} items={[
  { id: 'returns', title: 'Can an order be returned?', content: 'Within 30 days, in its box.' },
  { id: 'invoice', title: 'Where is the invoice?', subtitle: "In every order's page", content: 'Under Documents, as a PDF.' },
]} />
```

- One box, hairlines between its items, a `subtitle` in `muted-foreground`; `glass-card` under glass.
- A single "more" under a figure or a table is a `Disclosure` (the browser's `<details>`, which find in the page opens). Views of one thing, one shown at a time: `Tabs`.
- Formerly `SmoothAccordion`: that name still draws it until 1.0, and says so once in development.

## Accessibility

Each question is the browser's own button, in a heading with `headingLevel`, saying whether its answer is open (`aria-expanded`, and `aria-controls` its answer while it is); the answer is a region named by it. Tab goes from one question to the next, Enter or Space opens one and closes it.
