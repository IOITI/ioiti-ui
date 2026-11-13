import {
  Button,
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
  buttonClassName,
} from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

const LINES = [
  { item: 'Spring catalogue', quantity: 200, amount: '1,840.00 €' },
  { item: 'Shelving', quantity: 4, amount: '960.50 €' },
]
const trigger = buttonClassName({ variant: 'outline', size: 'sm' })

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-3 p-5">
    <Flysheet>
      <FlysheetTrigger className={trigger}>An order</FlysheetTrigger>
      <FlysheetContent resizable>
        <FlysheetHeader>
          <FlysheetTitle>Order 2026-0042</FlysheetTitle>
          <FlysheetDescription>Placed on 26 Oct by Acme. Drag its edge, or use the arrow keys on it, to widen it.</FlysheetDescription>
        </FlysheetHeader>
        <FlysheetBody className="space-y-4">
          <DescriptionList divided numeric items={LINES.map((line) => ({ term: `${line.item} × ${line.quantity}`, details: line.amount }))} />
        </FlysheetBody>
        <FlysheetFooter>
          <FlysheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</FlysheetClose>
          <Button size="sm">Send the invoice</Button>
        </FlysheetFooter>
      </FlysheetContent>
    </Flysheet>
    <span className="text-xs text-muted-foreground">Press it: the sheet slides in from the side.</span>
  </div>,
)
