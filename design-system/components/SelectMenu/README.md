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

- The button is 40px high on `surface` with `border`; the list floats in the document's body under it, or above it where there is more room, as wide as it, on `surface`, `shadow-elevated`, `glass-float` under glass, the option chosen ticked in the accent's `brand-text`.
- A long list, or one typed into, is a `Select` or a `Combobox`; several values, a `MultiSelect`.
- Formerly `SpringSelect`: that name still draws it until 1.0, and says so once in development.

## Accessibility

Its button is a combobox that keeps the focus: a screen reader hears its label, the value chosen and whether its list is open, then the option the keys are on, selected or not. An option that cannot be chosen is said dimmed, and the keys pass it by. Its `error` is said as it comes, and read with the button after.

| Key | What it does |
|---|---|
| ↓, ↑, Enter, Space | Closed: open the list on the option chosen |
| ↓, ↑ | Open: the next option, or the one before, stopping at the ends |
| Home, End | The first option, the last (opening the list) |
| Page Down, Page Up | Ten options on, or back |
| A letter | The next option that starts with it, or with the letters typed together (opening the list) |
| Enter, Space, Alt+↑ | Open: choose the option and close the list |
| Tab | Open: chooses the option, and goes on |
| Escape | Closes the list without a change, the focus staying on the button |
