# SplitButton

One action, and its variants behind the chevron: each option acts or leads somewhere, can say what it does, and can be marked as removing.

**You provide** `label` and `onClick` for the main action, `icon`, `variant`, `size`; `options`: `[{ value, label, description?, href? | onSelect?, tone?: 'danger', disabled? }]`.

```tsx
<SplitButton label="Run again" icon={<Play />} size="sm" onClick={rerun}
  options={[{ value: 'edit', label: 'Edit and run', href: '/runs/42/edit' },
            { value: 'delete', label: 'Delete', tone: 'danger', onSelect: remove }]} />
```

- The main action is the one asked most; the rest are its variants, not unrelated actions (those are a `DropdownMenu`).
