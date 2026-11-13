# Slider

A value along a scale (`Slider`), or a range between two (`RangeSlider`), its value said in words.

**You provide** `label`, `min`, `max`, `step`, `value` / `defaultValue`, `onChange`, `format(value)` for the words; `ticks` (`true`, or `[{ value, label }]`); `levels` (`[{ from, to, tone: 'positive' | 'warning' | 'negative' }]`) to show where a value is safe or too far; `showInput` for a field beside it.

```tsx
<Slider label="Risk per order" defaultValue={1.5} min={0} max={5} step={0.5}
  format={(v) => `${v.toFixed(1)}%`}
  levels={[{ from: 0, to: 2, tone: 'positive' }, { from: 2, to: 3.5, tone: 'warning' }, { from: 3.5, to: 5, tone: 'negative' }]} />
```

- It is the browser's range input: arrows, Page Up and Down, Home and End work.
- A precise value is typed: give it `showInput`, or use a `NumberInput`.
