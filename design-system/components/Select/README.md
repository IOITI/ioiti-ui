# Select

One value from a short list, in the browser's own select: a status, a carrier, a priority.

**You provide** `options` (`[{ value, label, disabled? }]`), or `<option>` and `<optgroup>` as children; what a `<select>` takes (`value` / `defaultValue`, `onChange`, `name`, `required`, `disabled`); `error` for its border in the negative colour.

```tsx
<Field label="Status">
  <Select options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} defaultValue="open" />
</Field>
```

- With no value yet, a first option of value `''`, disabled, asks for a choice ("Choose a carrier").
- It has the look of the `Input`, a chevron at its end; its list is the system's, at home on a phone.
- A list to search is a `Combobox`; options with a second line, a `SpringSelect`; several values, a `MultiSelect`.
