# SplitButton

One action, and its variants behind the chevron: each option acts or leads somewhere, can say what it does, and can be marked as removing.

**You provide** `label` and `onClick` for the main action, `icon`, `variant`, `size`; `options`: `[{ value, label, description?, href? | onSelect?, tone?: 'danger', disabled? }]`; `menuLabel`, the name of the chevron and its menu ("Other ways to run").

```tsx
<SplitButton label="Run again" icon={<Play />} size="sm" onClick={rerun}
  options={[{ value: 'edit', label: 'Edit and run', href: '/runs/42/edit' },
            { value: 'delete', label: 'Delete', tone: 'danger', onSelect: remove }]} />
```

- The main action is the one asked most; the rest are its variants, not unrelated actions (those are a `DropdownMenu`).

## Accessibility

Two buttons side by side: the main action (a link where it leads somewhere), and the chevron, named by `menuLabel`, which says it opens a menu and whether it is open. The menu keeps the focus and says the option the arrows are on; one that cannot be chosen is said dimmed, and the arrows pass it by.

| Key | What it does |
|---|---|
| Enter, Space | On the main action: does it, or follows its link. On the chevron: opens the menu on its first option |
| ↓, ↑ | The next option, or the one before; past the last, the first again |
| Home, End | The first option, the last |
| Enter, Space | Does what the option does, or follows its link, and closes the menu |
| Escape, Tab | Close the menu, the focus back on the chevron |
