import { buttonClassName, Flysheet, FlysheetBody, FlysheetContent, FlysheetDescription, FlysheetHeader, FlysheetTitle, FlysheetTrigger } from 'ioiti-ui'
import type { FlysheetSize } from 'ioiti-ui'

const SIZES: { size: FlysheetSize; label: string; use: string }[] = [
  { size: 'sm', label: 'sm, 22 rem', use: 'A few fields, a short record.' },
  { size: 'md', label: 'md, 26 rem', use: 'A record: the default.' },
  { size: 'lg', label: 'lg, 40 rem', use: 'A table, a long form.' },
  { size: 560, label: '560 px', use: 'Any width, in pixels; 88 % of the window at most.' },
]

export default function FlysheetSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SIZES.map(({ size, label, use }) => (
        <Flysheet key={label}>
          <FlysheetTrigger className={buttonClassName({ variant: 'outline', size: 'sm' })}>{label}</FlysheetTrigger>
          <FlysheetContent size={size}>
            <FlysheetHeader>
              <FlysheetTitle>{label}</FlysheetTitle>
              <FlysheetDescription>{use}</FlysheetDescription>
            </FlysheetHeader>
            <FlysheetBody>
              <p className="text-sm text-muted-foreground">On a phone, every side sheet is as wide as the screen allows.</p>
            </FlysheetBody>
          </FlysheetContent>
        </Flysheet>
      ))}
    </div>
  )
}
