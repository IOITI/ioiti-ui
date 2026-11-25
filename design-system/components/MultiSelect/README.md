# MultiSelect

Several values from a list, each a chip in the field: typing filters the list; options may be in groups, with a second line; what is typed may become a value of its own, a tag.

**You provide** `options` (`[{ value, label, description?, group?, disabled? }]`), `value` / `defaultValue` / `onChange` (an array of values); `placeholder`, `maxChips` (chips shown before "+N"), `max` (values at most: the list says so past it), `onCreateOption` (given the text typed, it gives the option made, or its value), `emptyText`, `disabled`, `error`. Its name: a `Field` or a `FormItem` around it, else `label`. In a form: `name`, each value chosen sent under it, in order. `id`, `ref` (the field typed into), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, as an input takes them.

```tsx
<Field label="Customers" htmlFor="customers">
  <MultiSelect id="customers" options={CUSTOMERS} defaultValue={['brun', 'acme', 'vega']} maxChips={2} placeholder="Choose customers" />
</Field>
```

- A `Field`'s label, around it or beside it (`htmlFor`), names the field typed into, and a click on the label leads there, never to a chip. One value from a list is a `Select` or a `Combobox`.
- The field has the look of the form's `Input`, its border the accent's `brand` in focus; the list floats in the document's body, `surface` ground, `border`, `radius-xl`, `glass-float` under glass.

## Accessibility

Its field is a combobox named by its label, which keeps the focus and says the option the arrows are on, ticked or not, under its group's name; past `max`, the list says so. When nothing matches, the list is empty and "Nothing matches" (`emptyText`) is shown beside it, describing it, and said to a screen reader once, as it comes to be: reading the field, it would hear nothing of the list. The chips are read before the field, their × no stop of the keyboard: the keys untick a value in the list, or take the last one back with Backspace. Clear, a button after the field, empties it.

| Key | What it does |
|---|---|
| Tab | Into the field: opens the list. Out of it: closes the list |
| Letters | Typed: filter the list |
| ↓, ↑ | Open the list; open, the next option or the one before, round from the last to the first |
| Enter | Ticks the option, or unticks it, the list staying open; with `onCreateOption`, makes a value of what is typed |
| Backspace | In an empty field: removes the last value |
| Escape | Closes the list; closed, empties what was typed |
