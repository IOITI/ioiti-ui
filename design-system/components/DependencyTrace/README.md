# DependencyTrace

What calls what: a node's health is a ring, an icon and a word; tracing one (the pointer, the focus, a click or Enter) lights what it calls and what calls it, and the bar below says so.

**You provide** `nodes` (`[{ id, label, x?, y?, status?, statusLabel?, detail? }]`, `status` one of `ok` · `warning` · `down` · `unknown` · `disabled`), `connections` (`[{ from, to, label? }]`, from what calls to what is called), `label` (the graph's name for a screen reader); `width` and `height` (the canvas `x` and `y` are on, 400 × 280 by default), `nodeSize` (`36` by default), `onNodeSelect`, `onNodeHover`.

```tsx
<DependencyTrace label="Services" width={520} height={260}
  nodes={[
    { id: 'api', label: 'API', x: 210, y: 130, status: 'ok', statusLabel: 'Up' },
    { id: 'queue', label: 'Queue', x: 360, y: 200, status: 'warning', statusLabel: 'Degraded', detail: '1,204 waiting' },
  ]}
  connections={[{ from: 'api', to: 'queue', label: 'jobs' }]} />
```

- Health rings: `positive` with ✓, `warning` with !, `negative` with ✕, `chart-muted` with ? or –; a node with no `status` (an outside service) has a `chart-axis` ring. Links are dashed `chart-muted` arrows at rest, solid blue (the accent's `brand` with one) while traced, with their `label`.
- Nodes without `x` and `y` go round an ellipse. The canvas scales to its container's width; the status bar is `glass-float` under glass.

## Accessibility

A region named by its `label`. Each node is a stop of the keyboard, a button named by its label and its health ("Billing: Down"), said pressed while its trace is kept; the bar below says what the node traced calls and what calls it, as it changes.

| Key | What it does |
|---|---|
| Tab, Shift+Tab | The next node, or the one before, traced as it takes the focus |
| Enter, Space | Keeps its trace, as a click does; again, lets it go |
