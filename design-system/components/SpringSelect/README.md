# SpringSelect

One value from a short list that springs open under its button, each option with a second line if it needs one.

**You provide** `options` (`[{ value, label, description?, disabled? }]`), `value` / `defaultValue`, `onChange` (told of a change only); `label` (shown over it, its name), or `id` for a `Field htmlFor`, or `aria-label` / `aria-labelledby`; `placeholder`, `error` (the words under it, which describe it), `name` (its value sent with a form), `disabled`.

```tsx
<SpringSelect label="Plan" defaultValue="team" options={[
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
  { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
]} />
```

- The focus stays on its button, a combobox: the arrows, Enter or Space open the list on the value; the arrows, Home, End, PageUp and PageDown move past the options that cannot be chosen, a letter typed goes to the next option it starts; Enter or Space choose, Tab chooses and goes on, Escape closes without a change.
- The button is 40px high on `surface` with `border`; the list floats in the document's body under it, or above it where there is more room, as wide as it, on `surface`, `shadow-elevated`, `glass-float` under glass, the option chosen ticked in the accent's `brand-text`.
- A long list, or one typed into, is a `Select` or a `Combobox`; several values, a `MultiSelect`.
