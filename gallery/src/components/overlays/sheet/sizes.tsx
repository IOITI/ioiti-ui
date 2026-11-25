import { buttonClassName, Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from 'ioiti-ui'
import type { SheetSize } from 'ioiti-ui'

const SIZES: { size: SheetSize; label: string; use: string }[] = [
  { size: 'sm', label: 'sm, 22 rem', use: 'A few fields, a short record.' },
  { size: 'md', label: 'md, 26 rem', use: 'A record: the default.' },
  { size: 'lg', label: 'lg, 40 rem', use: 'A table, a long form.' },
  { size: 560, label: '560 px', use: 'Any width, in pixels; 88 % of the window at most.' },
]

export default function SheetSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SIZES.map(({ size, label, use }) => (
        <Sheet key={label}>
          <SheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>{label}</SheetTrigger>
          <SheetContent size={size}>
            <SheetHeader>
              <SheetTitle>{label}</SheetTitle>
              <SheetDescription>{use}</SheetDescription>
            </SheetHeader>
            <SheetBody>
              <p className="text-sm text-muted-foreground">On a phone, every side sheet is as wide as the screen allows.</p>
            </SheetBody>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  )
}
