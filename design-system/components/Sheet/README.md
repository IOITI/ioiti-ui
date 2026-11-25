# Sheet

A sheet that slides in from a side of the page for a record or a form: over the page, or beside it; resizable; a child sheet beside its parent.

**You provide** `Sheet` around a `SheetTrigger` and a `SheetContent` (`side`, `size` `sm` · `md` · `lg`, `type="push"` to sit beside the page, `resizable`, `showCloseButton={false}` without its close button), with `SheetHeader` (`SheetTitle`, `SheetDescription`), `SheetBody` and `SheetFooter` (`SheetClose`, the primary `Button`).

```tsx
<Sheet>
  <SheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>An order</SheetTrigger>
  <SheetContent resizable>
    <SheetHeader><SheetTitle>Order 2026-0042</SheetTitle></SheetHeader>
    <SheetBody>…</SheetBody>
    <SheetFooter><SheetClose>Cancel</SheetClose><Button size="sm">Send the invoice</Button></SheetFooter>
  </SheetContent>
</Sheet>
```

- One dialog at a time. It slides with `springSheet` and leaves with `easeExit`.
- Its body scrolls under the header, which stays: scrolled, the body fades out under it, the fade as tall as the body has scrolled, up to 32 px (a mask, so on any surface, glass too). At rest, no fade.
- Formerly `Flysheet`, its parts `FlysheetTrigger`, `FlysheetContent` and the others: those names still draw them until 1.0, and say so once in development.

## Accessibility

A modal dialog, named by its `SheetTitle` (or `aria-label`) and described by its `SheetDescription`; its trigger says it opens one, and whether it is open. As it opens, the focus goes to the sheet itself, its name read first, and as it closes, back to its trigger. One that leaves the page in use (`modal={false}`), or is pushed beside it (`type="push"`, a region of the page), takes the focus as it opens but keeps none: Tab goes in and out of it. A child over its parent leaves nothing of the parent in reach. Its body, while it scrolls and holds no control, is a stop of the keyboard named by its title; its resize handle a separator that says its width.

| Key | What it does |
|---|---|
| Tab, Shift+Tab | The next control in it, or the one before, round from its last to its first while it holds the page |
| Escape | Closes it; a list or a menu open in it closes first. Beside the page, while the focus is in it |
| ←, → | On its resize handle: the arrow toward the page widens it by 10 px, the other narrows it (50 px with Shift) |
| Home, End | On its resize handle: its narrowest, its widest |
