# DonutChart

Parts of a whole, or one value against its limit as a half gauge: four segments take `chart-compare-1…4`, the rest one segment in `chart-muted`.

**You provide** `ariaLabel`, `data` (`[{ label, value, color? }]`), `centerLabel`; `variant="semi"` for a gauge; `showLegend`; `formatValue`.

```tsx
<DonutChart ariaLabel="Orders by channel" centerLabel="Orders" data={channels} />
```

- Hovering a segment or its legend line says its figure and share. More than five parts, or parts to compare exactly: a `BarChart`.
