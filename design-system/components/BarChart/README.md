# BarChart

Values by category, side by side or stacked, things compared in `chart-compare-1…4`; losses below zero, and `tone="sign"` colours each bar `chart-positive` or `chart-negative`.

**You provide** `ariaLabel`, `data` (`[{ label, <key>: number }]`), `series` (`[{ key, label }]`); `variant` (`grouped` · `stacked`), `tone="sign"`, `height`, `formatValue`, `formatTitle`, `details(datum)`.

```tsx
<BarChart ariaLabel="Margin by day" tone="sign" data={days} series={[{ key: 'margin', label: 'Margin' }]}
  formatValue={(v) => formatMoney(v)} />
```

- The arrow keys move from one category to the next; a table gives screen readers every figure. Ranked values with their labels: `BarList`.
