import { Button, Disclosure } from 'ioiti-ui'
import { useState } from 'react'

export default function DisclosureControlled() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm">The refund was refused by the card’s bank.</p>
        <Button variant="link" size="sm" onClick={() => setOpen(true)}>
          Why?
        </Button>
      </div>
      <Disclosure summary="What the bank answered" open={open} onOpenChange={setOpen}>
        <p className="text-sm text-muted-foreground">
          Code 05, “do not honour”: the bank gives no reason. The customer can ask it, or be refunded another way.
        </p>
      </Disclosure>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Open: <span className="font-medium text-foreground">{open ? 'yes' : 'no'}</span>
      </p>
    </div>
  )
}
