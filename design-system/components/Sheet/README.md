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

- One dialog at a time: a sheet keeps the focus and gives it back to its trigger. It slides with `springSheet` and leaves with `easeExit`.
- Its body scrolls under the header, which stays: scrolled, the body fades out under it, the fade as tall as the body has scrolled, up to 32 px (a mask, so on any surface, glass too). At rest, no fade.
- Formerly `Flysheet`, its parts `FlysheetTrigger`, `FlysheetContent` and the others: those names still draw them until 1.0, and say so once in development.
