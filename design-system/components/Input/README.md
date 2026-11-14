# Input

A field that takes a line of text: a name, an address, an amount and its unit, a password, a search.

**You provide** what an `<input>` takes (`type`, `value` / `defaultValue`, `onChange`, `placeholder`, `inputMode`, `autoComplete`, `disabled`, `readOnly`); `prefix` / `suffix` for a unit in the field; `leftIcon` / `rightIcon` (a lucide icon, `size-3.5`); `error` for its border in the negative colour; `showPasswordToggle` with `type="password"`.

```tsx
<Field label="Timeout" description="How long a request may take before it is given up">
  <Input inputMode="numeric" defaultValue="250" suffix="ms" />
</Field>
<Input type="password" autoComplete="new-password" showPasswordToggle />
```

- It goes under its label in a `Field`, which says what is wrong under it: `error` on the field marks its border only.
- A unit goes in the field (`prefix` "€", "https://"; `suffix` "ms", "kg"), not in the label: the text keeps clear of it, and a screen reader hears it with the field.
- 40px high, its text 12px, `radius-lg`; in focus its border darkens, the accent's `brand` with one, and no ring is drawn.
- A number changed by steps is a `NumberInput`; several lines, a `Textarea`.
