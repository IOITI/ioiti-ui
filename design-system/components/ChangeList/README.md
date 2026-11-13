# ChangeList

What changes, each from its value before to its value after: a configuration about to be applied, a record edited. What is added says "New", what is removed says "Removed"; screen readers hear "from … to …".

**You provide** `changes` (`[{ label, before?, after?, note? }]`), or `groups` (`[{ title, changes }]`) for changes by part; `label` (the list's name for a screen reader, "Changes to apply"); `numeric` for figures.

```tsx
<ChangeList label="Changes to apply" numeric changes={[
  { label: 'Daily limit', before: formatMoney(500), after: formatMoney(750), note: 'Applies from tomorrow, 00:00' },
  { label: 'Weekly summary', after: 'Every Monday, 08:00' },
]} />
```

- The label in `text-secondary`, the value before struck through in `text-muted`, the value after in `text-primary`; rows apart by `border`.
- Show it before a change is confirmed (in a `SettleModal`), or after, to say what was done. A history of versions is a `RecoveryLedger`.
