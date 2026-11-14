import {
  Button,
  buttonClassName,
  Checkbox,
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

export default function FlysheetSides() {
  const trigger = buttonClassName({ variant: 'outline', size: 'sm' })
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Flysheet>
        <FlysheetTrigger className={trigger}>Filters, from the left</FlysheetTrigger>
        <FlysheetContent side="left" size="sm" closePosition="outside">
          <FlysheetHeader>
            <FlysheetTitle>Filters</FlysheetTitle>
            <FlysheetDescription>Its close button outside it, over the page.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody className="space-y-3 py-3">
            {['Open', 'Sent', 'Late'].map((status) => (
              <Checkbox key={status} label={status} defaultChecked={status !== 'Late'} />
            ))}
          </FlysheetBody>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>From the top</FlysheetTrigger>
        <FlysheetContent side="top">
          <FlysheetHeader>
            <FlysheetTitle>Maintenance on Sunday</FlysheetTitle>
            <FlysheetDescription>The application is read-only from 06:00 to 07:00. Swiped up, it goes.</FlysheetDescription>
          </FlysheetHeader>
        </FlysheetContent>
      </Flysheet>

      <Flysheet>
        <FlysheetTrigger className={trigger}>From the bottom</FlysheetTrigger>
        <FlysheetContent side="bottom">
          <FlysheetHeader>
            <FlysheetTitle>Share the order</FlysheetTitle>
            <FlysheetDescription>Dragged down by its handle to close it, as on a phone.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetFooter>
            <FlysheetClose className={buttonClassName({ variant: 'ghost', size: 'sm' })}>Cancel</FlysheetClose>
            <Button size="sm">Copy the link</Button>
          </FlysheetFooter>
        </FlysheetContent>
      </Flysheet>
    </div>
  )
}
