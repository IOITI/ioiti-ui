import { buttonClassName, Flysheet, FlysheetBody, FlysheetContent, FlysheetDescription, FlysheetHeader, FlysheetTitle, FlysheetTrigger, Textarea } from 'ioiti-ui'
import { useState } from 'react'

export default function FlysheetPush() {
  const [width, setWidth] = useState<number | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Flysheet>
        <FlysheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>Notes, beside the page</FlysheetTrigger>
        <FlysheetContent type="push" size="sm" resizable onResize={setWidth}>
          <FlysheetHeader>
            <FlysheetTitle>Notes</FlysheetTitle>
            <FlysheetDescription>From a window 1024 px wide, the page makes room for them and stays in use; on a narrower one, they cover it.</FlysheetDescription>
          </FlysheetHeader>
          <FlysheetBody>
            <Textarea rows={6} aria-label="Notes" placeholder="What the next person should know" />
          </FlysheetBody>
        </FlysheetContent>
      </Flysheet>
      {width !== null && <span className="text-sm text-muted-foreground">Widened to {Math.round(width)} px.</span>}
    </div>
  )
}
