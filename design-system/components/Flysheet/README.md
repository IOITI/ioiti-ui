# Flysheet

A sheet that slides in from a side of the page for a record or a form: over the page, or beside it; resizable; a child sheet beside its parent.

**You provide** `Flysheet` around a `FlysheetTrigger` and a `FlysheetContent` (`side`, `size` `sm` · `md` · `lg`, `type="push"` to sit beside the page, `resizable`), with `FlysheetHeader` (`FlysheetTitle`, `FlysheetDescription`), `FlysheetBody` and `FlysheetFooter` (`FlysheetClose`, the primary `Button`).

```tsx
<Flysheet>
  <FlysheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>An order</FlysheetTrigger>
  <FlysheetContent resizable>
    <FlysheetHeader><FlysheetTitle>Order 2026-0042</FlysheetTitle></FlysheetHeader>
    <FlysheetBody>…</FlysheetBody>
    <FlysheetFooter><FlysheetClose>Cancel</FlysheetClose><Button size="sm">Send the invoice</Button></FlysheetFooter>
  </FlysheetContent>
</Flysheet>
```

- One dialog at a time: a sheet keeps the focus and gives it back to its trigger. It slides with `springSheet` and leaves with `easeExit`.
