import {
  Button,
  buttonClassName,
  DescriptionList,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'ioiti-ui'

const LINES = [
  { item: 'Standing desk', quantity: 2, amount: '1,240.00 €' },
  { item: 'Desk lamp', quantity: 4, amount: '360.00 €' },
  { item: 'Delivery', quantity: 1, amount: '240.00 €' },
]

export default function SheetRecord() {
  const trigger = buttonClassName({ variant: 'outline', size: 'sm' })
  return (
    <Sheet>
      <SheetTrigger className={trigger}>Order 2026-0042</SheetTrigger>
      <SheetContent resizable>
        <SheetHeader>
          <SheetTitle>Order 2026-0042</SheetTitle>
          <SheetDescription>Placed on 26 Oct by Acme. Drag its edge, or use the arrow keys on it, to widen it.</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-4">
          <DescriptionList divided numeric items={LINES.map((line) => ({ term: `${line.item} × ${line.quantity}`, details: line.amount }))} />
          {/* A child sheet: beside the order while the window has room for both, over it otherwise. */}
          <Sheet>
            <SheetTrigger className={trigger}>Acme, the customer</SheetTrigger>
            <SheetContent size="sm">
              <SheetHeader>
                <SheetTitle>Acme</SheetTitle>
                <SheetDescription>A customer since 2021: 14 orders, 18,420.00 €.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p className="text-sm text-muted-foreground">Escape closes it first; closing the order closes it too.</p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </SheetBody>
        <SheetFooter>
          <SheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</SheetClose>
          <Button size="sm">Send the invoice</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
