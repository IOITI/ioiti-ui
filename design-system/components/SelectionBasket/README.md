# SelectionBasket

What a table's selection can do: the count, select all, clear, and the actions, a disabled one saying why; it shows while something is selected.

**You provide** `selectedCount`, `totalCount`, `noun` (`['run', 'runs']`; `['item', 'items']` by default), `actions` (`[{ id, label, icon?, variant?, onClick?, href?, disabled?, title? }]`, `variant` one of `default` · `primary` · `danger`), `onClearSelection`, `onSelectAll`; `allSelected` (when a search hides some), `mode` (`fixed` by default, at the bottom of the window · `sticky` · `contained` · `inline`), `linkComponent`.

```tsx
<SelectionBasket mode="inline" selectedCount={selected.length} totalCount={runs.length} noun={['run', 'runs']}
  onClearSelection={clear} onSelectAll={selectAll}
  actions={[
    { id: 'compare', label: 'Compare', icon: <GitCompare className="size-3.5" />, href: compareUrl, disabled: selected.length < 2, title: 'Two to four runs can be compared' },
    { id: 'remove', label: 'Remove', icon: <Trash2 className="size-3.5" />, variant: 'danger', onClick: remove },
  ]} />
```

- An action that leads to another page has `href`: it is a link, the application's (`LinkProvider`) or `linkComponent`. A disabled action's `title` says why in a tooltip, on hover, focus or tap.
- The count and a `primary` action are ink (the accent's `brand` with one), `danger` is red; the bar floats, `glass-float` under glass. Too wide, it scrolls sideways inside itself.
- `DataTable` shows one under itself (its `selectionBasket`); use this one alone for a list of your own.
