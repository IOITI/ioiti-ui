# ChartLegend

What a chart's colours stand for, each swatch drawn as the chart draws its series (a bar, a line, a dashed line, a point, a moment marked); its items can show and hide their series. For an application's own charts too.

**You provide** `items` (`[{ label, color, shape?, value?, shown? }]`), each `shape` one of `square` (the default: a bar or an area) · `line` · `dashed` · `dot` · `marker`; `label` (its name for a screen reader, `Legend` by default); `onToggle(index)` to make each item a button that shows or hides its series, with `shown` on each item.

```tsx
<ChartLegend label="Runs" items={[
  { label: 'Run 41', color: 'var(--chart-compare-1)', shape: 'line', value: '+4.2%' },
  { label: 'Benchmark', color: 'var(--chart-muted)', shape: 'dashed', value: '+0.9%' },
  { label: 'Restart', color: 'var(--chart-axis)', shape: 'marker' },
]} />
```

- A `color` is the chart's own token: `chart-series` for one series, `chart-compare-1…4` in order for things compared, `chart-muted` for a benchmark or the rest, `chart-axis` for a moment marked.
- With `onToggle`, each item is a toggle button (`aria-pressed`); a hidden one is struck through, its swatch faded. The chart decides what it allows: keep one series shown.
- Labels in `text-secondary`, figures in `text-primary` with `tabular-nums`. `LineChart` and `BarChart` draw theirs with it; give them `showLegend={false}` to place your own.
