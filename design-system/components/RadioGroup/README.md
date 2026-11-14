# RadioGroup

One of two to five choices shown at once, each with its words: options given as data (`RadioGroup`), or its items laid out by hand (`RadioGroupItem`).

**You provide** for `RadioGroup`: `name`, `options` (`[{ value, label, description?, disabled? }]`), `value` / `defaultValue`, `onChange` (the value); or `RadioGroupItem`s as children. For `RadioGroupItem`: `name`, `value`, `label`, `description`, `checked`, `onChange`, `disabled`.

```tsx
<fieldset>
  <legend>Delivery</legend>
  <RadioGroup name="delivery" value={delivery} onChange={setDelivery} options={[
    { value: 'standard', label: 'Standard', description: 'Three to five days' },
    { value: 'express', label: 'Express', description: 'Tomorrow' },
  ]} />
</fieldset>
```

- Its name for a screen reader comes from around it: a `fieldset` and its `legend`.
- Each group has a `name` of its own: the dot slides from one choice to the next of the same name.
- Checked, its ring and its dot are `primary` (ink), the accent's `brand` with one. Short choices in a row are a `SegmentedControl`; more than five, a `Select`.
