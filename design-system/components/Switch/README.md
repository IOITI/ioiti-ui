# Switch

A setting that takes effect when it is turned: on or off, with its label and what it does.

**You provide** `label`, `description`, `checked` / `defaultChecked`, `onChange`, `disabled`.

```tsx
<Switch label="Weekly summary" description="Every Monday, by email" checked={weekly} onChange={setWeekly} />
```

- On, the track is `primary` (the accent's `brand` with one). The label says what is on, not "Enable …".
- One of two to five choices that need a description each is a `RadioGroup`; short choices in a row are a `SegmentedControl`.
