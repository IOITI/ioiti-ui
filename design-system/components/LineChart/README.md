# LineChart

Values over time: up to four series compared in `chart-compare-1…4`, or one series in `chart-series` with an area, its limit and the moments that matter.

**You provide** `aria-label`, `data` (`[{ t, <key>: number | null }]`), `series` (`[{ key, label, dashed? }]`), `formatValue`, `timeZone`; `area`, `zero`, `height`; `references` (`[{ value, label, tone }]`), `markers` (`[{ t, label }]`), `details(point)` for the tooltip; `connectGaps`.

```tsx
<LineChart aria-label="Delay of the orders" data={readings} series={[{ key: 'delay', label: 'Delay' }]}
  area zero references={[{ value: 250, label: 'Limit, 250 ms', tone: 'danger' }]}
  formatValue={(v) => `${Math.round(v)} ms`} />
```

- A gap in the data is a gap in the line. A benchmark is `dashed`. A fifth series has no colour: compare four at most.
- The pointer or the arrow keys read a moment; a table gives screen readers every point.

## FanChart

What was expected as ranges that widen, and what happened over them: a simulation's or a forecast's bands (where 90 % and half of its paths went), its median dashed, the actual line drawn as far as it goes. Its x axis is a count or a measure (trades, months from now), never a time.

**You provide** `aria-label`, `data` (`[{ x, <key>: number | null }]`, sorted by `x`), `bands` (`[{ lower, upper, label }]`, widest first), `lines` (`[{ key, label, dashed? }]`), `formatValue`, `formatX` (a place in words: "After trade 12") and `formatXTick`, `xLabel`; `references`, `markers` (`[{ x, label }]`), `zero`, `height`, `details(point)`.

```tsx
<FanChart aria-label="Real trades against the backtest" data={cone}
  bands={[{ lower: 'p5', upper: 'p95', label: '90 % of the paths' }, { lower: 'p25', upper: 'p75', label: 'Half of the paths' }]}
  lines={[{ key: 'median', label: 'Expected', dashed: true }, { key: 'actual', label: 'Real trades' }]}
  xLabel="Trades" formatX={(n) => `After trade ${n}`} formatValue={(v) => `${v.toFixed(1)}%`} />
```

- Bands take the charts' muted colour, one over the other deepening it; the lines take the series colour, or the compare colours when there are more.
- A line stops where its values stop (`null`): the actual line ends at the last place known.
- The pointer or the arrow keys read a place, each line's value and each band's range there; a table gives screen readers every place. Its legend shows and hides a line or a band, one kept shown.

## Accessibility

Each chart, `LineChart` and `FanChart`, is an image named by its `aria-label` ("Line chart of Delay" without one) and a stop of the keyboard: its arrows move the moment its tooltip shows, for the eye. A screen reader reads every figure in a table out of sight instead, captioned by its `aria-label`. The legend's items are buttons, pressed while what they stand for shows.

| Key | What it does |
|---|---|
| →, ← | The next moment (a place, in a `FanChart`), or the one before |
| Page Up, Page Down | A tenth of the moments on, or back |
| Home, End | The first moment, the last |
| Escape | Hides the tooltip |
