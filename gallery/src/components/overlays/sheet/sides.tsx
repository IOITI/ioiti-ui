import {
  Button,
  buttonClassName,
  Checkbox,
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

export default function SheetSides() {
  const trigger = buttonClassName({ variant: 'outline', size: 'sm' })
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Sheet>
        <SheetTrigger className={trigger}>Filters, from the left</SheetTrigger>
        <SheetContent side="left" size="sm" closePosition="outside">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Its close button outside it, over the page.</SheetDescription>
          </SheetHeader>
          <SheetBody className="space-y-3 py-3">
            {['Open', 'Sent', 'Late'].map((status) => (
              <Checkbox key={status} label={status} defaultChecked={status !== 'Late'} />
            ))}
          </SheetBody>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger className={trigger}>From the top</SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Maintenance on Sunday</SheetTitle>
            <SheetDescription>The application is read-only from 06:00 to 07:00. Swiped up, it goes.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger className={trigger}>From the bottom</SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Share the order</SheetTitle>
            <SheetDescription>Dragged down by its handle to close it, as on a phone.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</SheetClose>
            <Button size="sm">Copy the link</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
