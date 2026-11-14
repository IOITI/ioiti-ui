import {
  Button,
  buttonClassName,
  DescriptionList,
  Flysheet,
  FlysheetBody,
  FlysheetClose,
  FlysheetContent,
  FlysheetDescription,
  FlysheetFooter,
  FlysheetHeader,
  FlysheetTitle,
  FlysheetTrigger,
} from 'ioiti-ui'

const LINES = [
  { item: 'Standing desk', quantity: 2, amount: '1,240.00 €' },
  { item: 'Desk lamp', quantity: 4, amount: '360.00 €' },
  { item: 'Delivery', quantity: 1, amount: '240.00 €' },
]

export default function FlysheetRecord() {
  const trigger = buttonClassName({ variant: 'outline', size: 'sm' })
  return (
    <Flysheet>
      <FlysheetTrigger className={trigger}>Order 2026-0042</FlysheetTrigger>
      <FlysheetContent resizable>
        <FlysheetHeader>
          <FlysheetTitle>Order 2026-0042</FlysheetTitle>
          <FlysheetDescription>Placed on 26 Oct by Acme. Drag its edge, or use the arrow keys on it, to widen it.</FlysheetDescription>
        </FlysheetHeader>
        <FlysheetBody className="space-y-4">
          <DescriptionList divided numeric items={LINES.map((line) => ({ term: `${line.item} × ${line.quantity}`, details: line.amount }))} />
          {/* A child sheet: beside the order while the window has room for both, over it otherwise. */}
          <Flysheet>
            <FlysheetTrigger className={trigger}>Acme, the customer</FlysheetTrigger>
            <FlysheetContent size="sm">
              <FlysheetHeader>
                <FlysheetTitle>Acme</FlysheetTitle>
                <FlysheetDescription>A customer since 2021: 14 orders, 18,420.00 €.</FlysheetDescription>
              </FlysheetHeader>
              <FlysheetBody>
                <p className="text-sm text-muted-foreground">Escape closes it first; closing the order closes it too.</p>
              </FlysheetBody>
            </FlysheetContent>
          </Flysheet>
        </FlysheetBody>
        <FlysheetFooter>
          <FlysheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</FlysheetClose>
          <Button size="sm">Send the invoice</Button>
        </FlysheetFooter>
      </FlysheetContent>
    </Flysheet>
  )
}
