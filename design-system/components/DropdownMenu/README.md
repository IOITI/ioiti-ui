# DropdownMenu

The actions on a thing, behind a button (`DropdownMenu`) or at the pointer (`ContextMenu`): each acts, leads somewhere or is ticked, with more in a sub-menu.

**You provide** `label`, `trigger` (or the area as children for `ContextMenu`), `items`: actions `{ label, icon?, shortcut?, onSelect, tone?: 'danger' }`, links `{ type: 'link', label, href }`, `{ type: 'submenu', label, items }`, `{ type: 'checkbox', label, checked, onCheckedChange }`, `{ type: 'radio', label, value, onValueChange, options }`, `{ type: 'separator' }`; `open` / `defaultOpen` with `onOpenChange`, where the page holds it.

```tsx
<DropdownMenu label="Actions on order IT-1042" trigger={<IconButton label="More actions" icon={<Ellipsis />} />}
  items={[{ label: 'Edit', icon: <Pencil />, shortcut: 'e', onSelect: edit },
          { type: 'separator' }, { label: 'Delete', icon: <Trash2 />, tone: 'danger', onSelect: remove }]} />
```

- What removes goes last, after a separator, in `tone: 'danger'`.

## Accessibility

Its button says it opens a menu, and whether it is open; the menu is named by its `label`. Each row is said as what it is: an item, a box ticked or not, a choice of a group (named by its label) checked or not, an item with a sub-menu; a link to the page shown is said current. A disabled row is said so, and the arrows pass it by. `ContextMenu`'s menu is the same, opened where the pointer or the focus is.

| Key | What it does |
|---|---|
| Enter, Space, ↓ | On its button: opens the menu, the focus on its first row |
| ↑ | On its button: opens the menu on its last row |
| Shift+F10, the menu key | In `ContextMenu`'s area: opens its menu at what has the focus |
| ↓, ↑ | The next row, or the one before; past the last, the first again |
| Home, End | The first row, the last |
| A letter | The next row whose words start with it, or with the letters typed together |
| Enter, Space | Does what the row does, or follows its link, and closes the menu; a box is ticked or unticked, the menu staying open |
| → | Opens the row's sub-menu, in the menu's place |
| ← | Back from a sub-menu, to the row that opened it |
| Escape, Tab | Close the menu, the focus back on its button (on what had it, for `ContextMenu`) |
