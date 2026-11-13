# SegmentedControl

Two to five choices shown at once, the chosen one filled as a primary button is, the fill sliding to the next.

**You provide** `label` (for screen readers), `options` (`[{ value, label, icon?, disabled? }]`), `value` / `defaultValue`, `onChange`; `size`; `fullWidth`.

```tsx
<SegmentedControl label="Period" value={period} onChange={setPeriod}
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
```

- The arrow keys move and choose; Tab leaves. Used as tabs, it switches panels.
- More than five choices, or long labels: a `Select`.
