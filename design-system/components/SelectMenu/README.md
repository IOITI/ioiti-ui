# SelectMenu

One value from a short list that springs open under its button, each option with a second line if it needs one.

**You provide** `options` (`[{ value, label, description?, disabled? }]`), `value` / `defaultValue`, `onChange` (told of a change only); `label` (shown over it, its name), or a `Field` or a `FormItem` around it, or `aria-label` / `aria-labelledby`; `placeholder`, `error` (the words under it, which describe it), `disabled`. In a form: `name`, the value chosen (empty while none is). `id` (for a `Field htmlFor`), `ref` (its button), `aria-describedby`, `aria-invalid`, as a native control takes them.

```tsx
<SelectMenu label="Plan" defaultValue="team" options={[
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
  { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
]} />
```

- The focus stays on its button, a combobox: the arrows, Enter or Space open the list on the value; the arrows, Home, End, PageUp and PageDown move past the options that cannot be chosen, a letter typed goes to the next option it starts; Enter or Space choose, Tab chooses and goes on, Escape closes without a change.
- The button is 40px high on `surface` with `border`; the list floats in the document's body under it, or above it where there is more room, as wide as it, on `surface`, `shadow-elevated`, `glass-float` under glass, the option chosen ticked in the accent's `brand-text`.
- A long list, or one typed into, is a `Select` or a `Combobox`; several values, a `MultiSelect`.
- Formerly `SpringSelect`: that name still draws it until 1.0, and says so once in development.
