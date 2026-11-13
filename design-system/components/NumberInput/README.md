# NumberInput

A number to type, or to change with the arrow keys (ten at a time with Shift) and its − and + buttons: a limit, a quantity, a delay with its unit.

**You provide** `value` / `defaultValue`, `onChange`, `min`, `max`, `step`; `integer` or `precision`; `suffix` / `prefix` for the unit; an `id` for its `Field`.

```tsx
<Field label="Daily limit" htmlFor="daily-limit">
  <NumberInput id="daily-limit" defaultValue={500} min={0} max={5000} step={50} suffix="€" />
</Field>
```

- What is typed stays until the field is left; a comma or a point marks the decimals; it keeps to its bounds.
