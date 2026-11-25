# RadioGroup

One of two to five choices shown at once, each with its words: options given as data (`RadioGroup`), or its items laid out by hand (`RadioGroupItem`).

**You provide** for `RadioGroup`: `name` (what a form sends the value chosen under, as radios do), `options` (`[{ value, label, description?, disabled? }]`), `value` / `defaultValue`, `onChange` (the value), its name (a `Field` or a `FormItem` around it, `aria-label`, or `aria-labelledby` the id of what asks the question); or `RadioGroupItem`s as children. `id`, `ref` (the group), `aria-describedby`, `aria-invalid`, as a `fieldset` takes them. For `RadioGroupItem`: `name`, `value`, `label`, `description`, `checked`, `onChange`, `disabled`.

```tsx
<fieldset>
  <legend>Delivery</legend>
  <RadioGroup name="delivery" value={delivery} onChange={setDelivery} options={[
    { value: 'standard', label: 'Standard', description: 'Three to five days' },
    { value: 'express', label: 'Express', description: 'Tomorrow' },
  ]} />
</fieldset>
```

- Its name for a screen reader comes from around it: a `fieldset` and its `legend`, or the label of a `Field` or a `FormItem`, which names the group and none of its radios.
- Each group has a `name` of its own: the dot slides from one choice to the next of the same name.
- Checked, its ring and its dot are `primary` (ink), the accent's `brand` with one. Short choices in a row are a `SegmentedControl`; more than five, a `Select`.

## Accessibility

A radio group named by what is around it; each choice is the browser's own radio, named by its words and its description, said checked or not. The group is one stop of the keyboard.

| Key | What it does |
|---|---|
| Tab | Onto the choice made (the first, while none is); again, out of the group |
| ↓, →, ↑, ← | The next choice or the one before, chosen at once; past the last, the first again |
| Space | Chooses the radio that has the focus |
