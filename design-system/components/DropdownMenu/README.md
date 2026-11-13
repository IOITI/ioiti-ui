# DropdownMenu

The actions on a thing, behind a button (`DropdownMenu`) or at the pointer (`ContextMenu`): each acts, leads somewhere or is ticked, with more in a sub-menu.

**You provide** `label`, `trigger` (or the area as children for `ContextMenu`), `items`: actions `{ label, icon?, shortcut?, onSelect, tone?: 'danger' }`, links `{ type: 'link', label, href }`, `{ type: 'submenu', label, items }`, `{ type: 'checkbox', label, checked, onCheckedChange }`, `{ type: 'radio', label, value, onValueChange, options }`, `{ type: 'separator' }`.

```tsx
<DropdownMenu label="Actions on order IT-1042" trigger={<IconButton label="More actions" icon={<Ellipsis />} />}
  items={[{ label: 'Edit', icon: <Pencil />, shortcut: 'e', onSelect: edit },
          { type: 'separator' }, { label: 'Delete', icon: <Trash2 />, tone: 'danger', onSelect: remove }]} />
```

- The arrows move, a letter jumps, Escape closes, Tab leaves. What removes goes last, after a separator, in `tone: 'danger'`.
