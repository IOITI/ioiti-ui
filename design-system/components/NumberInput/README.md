# NumberInput

A number to type, or to change with the arrow keys (ten at a time with Shift) and its − and + buttons: a limit, a quantity, a delay with its unit.

**You provide** `value` / `defaultValue`, `onChange`, `min`, `max`, `step`; `integer` or `precision`; `suffix` / `prefix` for the unit; an `id` for its `Field`.

```tsx
<Field label="Daily limit" htmlFor="daily-limit">
  <NumberInput id="daily-limit" defaultValue={500} min={0} max={5000} step={50} suffix="€" />
</Field>
```

- What is typed stays until the field is left, read as the locale writes numbers and as people type them ("1 234,5" and "1234.5" in French; "1,500" is 1500 in English, "1,5" 1.5); it is shown again in the locale ("1234,5" in French), and keeps to its bounds.
