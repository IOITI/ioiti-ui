import { buttonClassName, Flysheet, FlysheetBody, FlysheetContent, FlysheetDescription, FlysheetHeader, FlysheetTitle, FlysheetTrigger } from 'ioiti-ui'
import { useState } from 'react'

export default function FlysheetNonModal() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Flysheet
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          if (!next) setReason(details?.reason ?? null)
        }}
      >
        <FlysheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>Help, without a backdrop</FlysheetTrigger>
        <FlysheetContent modal={false} size="sm">
          <FlysheetHeader>
            <FlysheetTitle>Help</FlysheetTitle>
            <FlysheetDescription>The page stays in use under it: its trigger closes it, and Escape while the focus is in it.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody>
            <p className="text-sm text-muted-foreground">An order is sent once its lines are checked. Its invoice follows by email.</p>
          </FlysheetBody>
        </FlysheetContent>
      </Flysheet>
      <span className="text-sm text-muted-foreground">
        {open ? 'Open.' : reason ? `Closed (${reason}).` : 'Closed.'}
      </span>
    </div>
  )
}
