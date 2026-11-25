# Slider

A value along a scale (`Slider`), or a range between two (`RangeSlider`), its value said in words.

**You provide** `label` (or a `Field` or a `FormItem` around it, which names it), `min`, `max`, `step`, `value` / `defaultValue`, `onChange`, `format(value)` for the words; `ticks` (`true`, or `[{ value, label }]`); `levels` (`[{ from, to, tone: 'success' | 'warning' | 'danger' }]`) to show where a value is safe or too far; `showInput` for a field beside it. In a form: `name`, its value sent (a `RangeSlider`'s two, the lower first). `id`, `ref` (its range input; a `RangeSlider`'s first thumb), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, as a range input takes them.

```tsx
<Slider label="Risk per order" defaultValue={1.5} min={0} max={5} step={0.5}
  format={(v) => `${v.toFixed(1)}%`}
  levels={[{ from: 0, to: 2, tone: 'success' }, { from: 2, to: 3.5, tone: 'warning' }, { from: 3.5, to: 5, tone: 'danger' }]} />
```

- A precise value is typed: give it `showInput`, or use a `NumberInput`.

## Accessibility

The browser's range input, named by its label, its value said in words (`format`: "1.5%", not "1.5"). A `RangeSlider` is two of them, its lower thumb then its upper, named by the label and their end ("Price, from", "Price, to"), neither passing the other.

| Key | What it does |
|---|---|
| →, ↑ | One `step` more |
| ←, ↓ | One `step` less |
| Page Up, Page Down | A tenth of the scale more, or less (a `step` at least) |
| Home, End | Its least value, its greatest |
| Tab | From the lower thumb to the upper, then to its field (`showInput`) |
