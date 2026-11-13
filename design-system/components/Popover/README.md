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
