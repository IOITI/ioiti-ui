# LineChart

Values over time: up to four series compared in `chart-compare-1…4`, or one series in `chart-series` with an area, its limit and the moments that matter.

**You provide** `ariaLabel`, `data` (`[{ t, <key>: number | null }]`), `series` (`[{ key, label, dashed? }]`), `formatValue`, `timeZone`; `area`, `zero`, `height`; `references` (`[{ value, label, tone }]`), `markers` (`[{ t, label }]`), `details(point)` for the tooltip; `connectGaps`.

```tsx
<LineChart ariaLabel="Delay of the orders" data={readings} series={[{ key: 'delay', label: 'Delay' }]}
  area zero references={[{ value: 250, label: 'Limit, 250 ms', tone: 'negative' }]}
  formatValue={(v) => `${Math.round(v)} ms`} />
```

- A gap in the data is a gap in the line. A benchmark is `dashed`. A fifth series has no colour: compare four at most.
- The pointer or the arrow keys read a moment; a table gives screen readers every point.
