# StatCard

A figure and its line over time, in a `StatGrid`: the line can be scrubbed with the pointer or the arrows to read a day; the change is shown only against what it changes from.

**You provide** `label`, `value`, `format(value)`, `trend` (values in order) and `trendLabels`; `previous` (the change is computed) or `delta` (a percentage); `period` ("vs last week"); `goodWhen="down"` where less is better.

```tsx
<StatCard label="Revenue" value={23950} previous={21480} period="vs last week"
  trend={[18200, 19400, 21480, 20100, 23950]} format={(v) => formatMoney(v)} />
```

## Accessibility

A stop of the keyboard, a group named by its label, its figure and its change ("Revenue: €23,950.00, up 11.5%"); its line is an image named by its trend ("Revenue trend from €18,200.00 to €23,950.00"). Its arrows read the line a point at a time, each point's name and figure said as it is reached.

| Key | What it does |
|---|---|
| ←, → | The point before, the next; the first press, either way, the last point |
| Escape | Back to the figure |
