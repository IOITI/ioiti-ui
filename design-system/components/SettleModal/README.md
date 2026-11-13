# SettleModal

A dialog, in four widths (and a full one, for two things side by side): it settles in from what opened it, keeps the focus, and gives it back.

**You provide** `open`, `onClose`, `title`, `description`, the content as `children`, `footer` (the buttons); `size` (`sm` · `md` · `lg` · `xl` · `full`, `md` by default); `closeOnBackdrop` (`true`), `hideCloseButton`.

```tsx
<SettleModal open={open} onClose={close} title="Rename the project"
  description="Its address stays the same: links to it keep working."
  footer={<><Button variant="ghost" size="sm" onClick={close}>Cancel</Button><Button size="sm" onClick={rename}>Rename</Button></>}>
  <Input aria-label="Name" />
</SettleModal>
```

- One dialog at a time, drawn in the document's body. The focus moves into it, Tab stays in it, and it goes back to what opened it; Escape or a click outside closes it.
- The footer is on the right: a ghost Cancel, then the one primary button. To confirm what cannot be undone, `ConfirmAction` (built on it). A record beside the page is a `Flysheet`.
- It draws with `surface`, `border`, `text-primary`, `text-secondary`, `shadow-elevated` and `radius-2xl`, over a black scrim at 50%; under glass, `glass-float` over `glass-scrim`.
