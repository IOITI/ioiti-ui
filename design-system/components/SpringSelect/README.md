# SpringSelect

One value from a short list that springs open under its button, each option with a second line if it needs one.

**You provide** `options` (`[{ value, label, description?, disabled? }]`), `value` / `defaultValue`, `onChange`; `label` (shown over it), `placeholder`, `error` (the words under it), `disabled`.

```tsx
<SpringSelect label="Plan" defaultValue="team" options={[
  { value: 'solo', label: 'Solo', description: 'One user' },
  { value: 'team', label: 'Team', description: 'Up to ten users' },
  { value: 'company', label: 'Company', description: 'Unlimited', disabled: true },
]} />
```

- The arrows, Enter or Space open it; the arrows move, Enter chooses, Escape closes.
- The button is 40px high on `surface-raised` with `border`; the list floats under it on `surface`, `shadow-elevated`, `glass-float` under glass, the option chosen ticked in the accent's `brand-text`.
- A long list, or one typed into, is a `Select` or a `Combobox`; several values, a `MultiSelect`.
