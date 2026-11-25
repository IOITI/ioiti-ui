# Dialog

A dialog, in four widths (and a full one, for two things side by side): it settles in from what opened it, keeps the focus, and gives it back.

**You provide** `open` / `onOpenChange` (or `defaultOpen`, the dialog then closing itself), `onClose` (told too as it closes), `title`, `description`, the content as `children`, `footer` (the buttons); `size` (`sm` · `md` · `lg` · `xl` · `full`, `md` by default); `closeOnBackdrop` (`true`), `showCloseButton` (`true`; formerly `hideCloseButton`, the other way round).

```tsx
<Dialog open={open} onOpenChange={setOpen} title="Rename the project"
  description="Its address stays the same: links to it keep working."
  footer={<><Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button><Button size="sm" onClick={rename}>Rename</Button></>}>
  <Input aria-label="Name" />
</Dialog>
```

- One dialog at a time, drawn in the document's body; a click outside closes it (`closeOnBackdrop`).
- The footer is on the right: a ghost Cancel, then the one primary button. To confirm what cannot be undone, `ConfirmAction` (built on it). A record beside the page is a `Sheet`.
- It draws with `surface`, `border`, `text-primary`, `text-secondary`, `shadow-elevated` and `radius-2xl`, over a black scrim at 50%; under glass, `glass-float` over `glass-scrim`.
- Formerly `SettleModal`: that name still draws it until 1.0, and says so once in development.

## Accessibility

A modal dialog, named by its `title` and described by its `description`. One without a title is named by `aria-label` (or `aria-labelledby`), or a screen reader says "dialog" and nothing else: in development, a dialog with no name says so in the console. As it opens, the focus goes to the dialog itself, its name read first, and as it closes, back to what opened it. Its × is a button named Close.

| Key | What it does |
|---|---|
| Tab, Shift+Tab | The next control in it, or the one before, round from its last to its first |
| Escape | Closes it; a list or a menu open in it closes first |
