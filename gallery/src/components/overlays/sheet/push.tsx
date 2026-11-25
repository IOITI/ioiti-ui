import { buttonClassName, Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Textarea } from 'ioiti-ui'
import { useState } from 'react'

export default function SheetPush() {
  const [width, setWidth] = useState<number | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Sheet>
        <SheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>Notes, beside the page</SheetTrigger>
        <SheetContent type="push" size="sm" resizable onResize={setWidth}>
          <SheetHeader>
            <SheetTitle>Notes</SheetTitle>
            <SheetDescription>From a window 1024 px wide, the page makes room for them and stays in use; on a narrower one, they cover it.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <Textarea rows={6} aria-label="Notes" placeholder="What the next person should know" />
          </SheetBody>
        </SheetContent>
      </Sheet>
      {width !== null && <span className="text-sm text-muted-foreground">Widened to {Math.round(width)} px.</span>}
    </div>
  )
}
