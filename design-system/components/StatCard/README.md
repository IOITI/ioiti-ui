# StatCard

A figure and its line over time, in a `StatGrid`: the line can be scrubbed with the pointer or the arrows to read a day; the change is shown only against what it changes from.

**You provide** `label`, `value`, `format(value)`, `trend` (values in order) and `trendLabels`; `previous` (the change is computed) or `delta` (a percentage); `period` ("vs last week"); `goodWhen="down"` where less is better.

```tsx
<StatCard label="Revenue" value={23950} previous={21480} period="vs last week"
  trend={[18200, 19400, 21480, 20100, 23950]} format={(v) => formatMoney(v)} />
```
