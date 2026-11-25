import { buttonClassName, Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from 'ioiti-ui'
import { useState } from 'react'

export default function SheetNonModal() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Sheet
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          if (!next) setReason(details?.reason ?? null)
        }}
      >
        <SheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>Help, without a backdrop</SheetTrigger>
        <SheetContent modal={false} size="sm">
          <SheetHeader>
            <SheetTitle>Help</SheetTitle>
            <SheetDescription>The page stays in use under it: its trigger closes it, and Escape while the focus is in it.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p className="text-sm text-muted-foreground">An order is sent once its lines are checked. Its invoice follows by email.</p>
          </SheetBody>
        </SheetContent>
      </Sheet>
      <span className="text-sm text-muted-foreground">
        {open ? 'Open.' : reason ? `Closed (${reason}).` : 'Closed.'}
      </span>
    </div>
  )
}
