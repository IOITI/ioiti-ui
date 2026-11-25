# SegmentedControl

Two to five choices shown at once, the chosen one filled as a primary button is, the fill sliding to the next.

**You provide** `label` (for screen readers; or a `Field` or a `FormItem` around it, which names the group), `options` (`[{ value, label, icon?, disabled? }]`), `value` / `defaultValue`, `onChange`; `size`; `fullWidth`. In a form: `name`, the value chosen (nothing while none is, as radios). `id`, `ref` (the group), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a radio group takes them.

```tsx
<SegmentedControl label="Period" value={period} onChange={setPeriod}
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
```

- Used as tabs (`role="tablist"`, each option's `panelId` the panel it shows), it switches panels.
- More than five choices, or long labels: a `Select`.

## Accessibility

A radio group named by its `label`, each choice said checked or not; as tabs, a tab list, each tab said selected. One stop of the keyboard: the choice made, or the first that can be; a disabled one is passed by.

| Key | What it does |
|---|---|
| →, ↓ | The next choice, chosen at once; past the last, the first again |
| ←, ↑ | The choice before |
| Home, End | The first choice, the last |
| Space, Enter | Chooses the one that has the focus (the first, while none is chosen) |
