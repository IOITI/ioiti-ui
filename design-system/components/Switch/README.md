# Switch

A setting that takes effect when it is turned: on or off, with its label and what it does; with `RadioGroup` for one of a few choices described in words.

**You provide** for `Switch`: `label`, `description`, `checked` / `defaultChecked`, `onChange`, `disabled`. For `RadioGroup`: `name`, `options` (`[{ value, label, description }]`), `value` / `defaultValue`, `onChange`.

```tsx
<Switch label="Weekly summary" description="Every Monday, by email" checked={weekly} onChange={setWeekly} />
```

- On, the track is `primary` (the accent's `brand` with one). The label says what is on, not "Enable …".
- Two to five choices that need a description each are radio buttons; short choices in a row are a `SegmentedControl`.
