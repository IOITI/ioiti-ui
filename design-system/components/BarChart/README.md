# BarChart

Values by category, side by side or stacked, things compared in `chart-compare-1…4`; losses below zero, and `colorBy="sign"` (formerly `tone`) colours each bar `chart-positive` or `chart-negative`.

**You provide** `aria-label`, `data` (`[{ label, <key>: number }]`), `series` (`[{ key, label }]`); `variant` (`grouped` · `stacked`), `colorBy="sign"`, `height`, `formatValue`, `formatTitle`, `details(datum)`.

```tsx
<BarChart aria-label="Margin by day" colorBy="sign" data={days} series={[{ key: 'margin', label: 'Margin' }]}
  formatValue={(v) => formatMoney(v)} />
```

- The arrow keys move from one category to the next; a table gives screen readers every figure. Ranked values with their labels: `BarList`.

## Accessibility

An image named by its `aria-label` (its series and how many categories, without one) and a stop of the keyboard: its arrows move the category its tooltip shows, for the eye. A screen reader reads every figure in a table out of sight instead. The legend's items are buttons, pressed while their series shows.

| Key | What it does |
|---|---|
| →, ← | The next category, or the one before |
| Home, End | The first category, the last |
| Escape | Hides the tooltip |
