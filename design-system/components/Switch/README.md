# Switch

A setting that takes effect when it is turned: on or off, with its label and what it does.

**You provide** `label`, `description`, `checked` / `defaultChecked`, `onChange`, `disabled`. In a form: `name`, sent while on as a checkbox is (its `value`, `on` by default), `required`. Without a label of its own: `aria-label`, or a `Field` or a `FormItem` around it. `id`, `ref` (its button).

```tsx
<Switch label="Weekly summary" description="Every Monday, by email" checked={weekly} onChange={setWeekly} />
```

- On, the track is `primary` (the accent's `brand` with one). The label says what is on, not "Enable …".
- In a `Field` or a `FormItem`, the field's label names it and its description and its error are read out with it, as with an `Input`.
- One of two to five choices that need a description each is a `RadioGroup`; short choices in a row are a `SegmentedControl`.
