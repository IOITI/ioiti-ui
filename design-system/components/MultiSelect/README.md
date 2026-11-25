# MultiSelect

Several values from a list, each a chip in the field: typing filters the list; options may be in groups, with a second line; what is typed may become a value of its own, a tag.

**You provide** `options` (`[{ value, label, description?, group?, disabled? }]`), `value` / `defaultValue` / `onChange` (an array of values); `placeholder`, `maxChips` (chips shown before "+N"), `max` (values at most: the list says so past it), `onCreateOption` (given the text typed, it gives the option made, or its value), `emptyText`, `disabled`, `error`. Its name: a `Field` or a `FormItem` around it, else `label`. In a form: `name`, each value chosen sent under it, in order. `id`, `ref` (the field typed into), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, as an input takes them.

```tsx
<Field label="Customers" htmlFor="customers">
  <MultiSelect id="customers" options={CUSTOMERS} defaultValue={['brun', 'acme', 'vega']} maxChips={2} placeholder="Choose customers" />
</Field>
```

- The arrows move in the list, Enter ticks or unticks, Escape closes it, Backspace in an empty field removes the last chip.
- A `Field`'s label, around it or beside it (`htmlFor`), names the field typed into, and a click on the label leads there, never to a chip. One value from a list is a `Select` or a `Combobox`.
- The field has the look of the form's `Input`, its border the accent's `brand` in focus; the list floats in the document's body, `surface` ground, `border`, `radius-xl`, `glass-float` under glass.
