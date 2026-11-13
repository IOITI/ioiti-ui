# MultiSelect

Several values from a list, each a chip in the field: typing filters the list; options may be in groups, with a second line; what is typed may become a value of its own, a tag.

**You provide** `options` (`[{ value, label, description?, group?, disabled? }]`), `value` / `defaultValue` / `onChange` (an array of values); `id` for a `Field htmlFor`, or `label` where no label names it; `placeholder`, `maxChips` (chips shown before "+N"), `onCreateOption` (given the text typed, it gives the option made, or its value), `emptyText`, `disabled`, `error`.

```tsx
<Field label="Customers" htmlFor="customers">
  <MultiSelect id="customers" options={CUSTOMERS} defaultValue={['brun', 'acme', 'vega']} maxChips={2} placeholder="Choose customers" />
</Field>
```

- The arrows move in the list, Enter ticks or unticks, Escape closes it, Backspace in an empty field removes the last chip.
- It takes its label beside it (`Field htmlFor`), not around it. One value from a list is a `Select` or a `Combobox`.
- The field has the look of the form's `Input`, its border the accent's `brand` in focus; the list floats in the document's body, `surface` ground, `border`, `radius-xl`, `glass-float` under glass.
