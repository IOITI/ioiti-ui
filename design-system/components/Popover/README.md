# Popover

A panel beside a button for filters or a few settings: the focus goes into it, and Escape, a Tab past its end or a press elsewhere closes it, the focus back on its button.

**You provide** `label`, `trigger` (a `Button` or an `IconButton`), the panel as `children` (or a function given `close`); `side`, `align`; `open` / `defaultOpen` / `onOpenChange`.

```tsx
<Popover label="Filters" trigger={<Button variant="outline" size="sm">Filters</Button>}>
  {(close) => <form onSubmit={() => close()}>…</form>}
</Popover>
```

- It is placed in the document's body, beside its trigger where the window has room. The page stays in use behind it.
- It floats: `popover` ground, `shadow-elevated`, `radius-xl`; `glass-float` under glass. A list of actions is a `DropdownMenu`, not a popover.

## Accessibility

Its button says it opens a dialog, and whether it is open; the panel is that dialog, named by its `label`, not modal: the page stays in reach. As it opens, the focus goes to its first control (to the panel, where it holds none).

| Key | What it does |
|---|---|
| Enter, Space | On its button: opens it |
| Tab, Shift+Tab | The next control in it, or the one before; past its last or before its first, closes it, the focus back on its button |
| Escape | Closes it, the focus back on its button |
