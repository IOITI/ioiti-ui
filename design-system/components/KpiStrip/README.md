# KpiStrip

Secondary figures in one panel, divided by hairlines: as many across as there are (six at most), three on a tablet, two on a phone.

**You provide** `items` (`[{ label, value, hint?, change?, goodWhen?, changeFormat? }]`, what a `KpiTile` takes); `title`; `period` (what the changes are compared with, said once); `columns` (2–6) to set the count from 1024px.

```tsx
<KpiStrip title="This week" period="Compared with last week"
  items={[{ label: 'Orders', value: '214', change: 6.5 }, { label: 'Refunds', value: '9', change: 12.5, goodWhen: 'down' }]} />
```

- The figures that support the tiles above it: a `KpiGrid` first, a strip under it, never a strip alone at the top of a page.
- Each figure is a term and its value (`dl`); its change is signed and in the tone of what it means, as a tile's.
- The hairlines are `border` at 70%, drawn by each figure and cut at the panel's edge: they hold however the row wraps. Under glass it is `glass-card` with a lit edge.
