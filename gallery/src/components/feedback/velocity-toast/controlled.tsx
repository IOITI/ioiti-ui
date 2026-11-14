import { Button, SegmentedControl, VelocityToast } from 'ioiti-ui'
import type { VelocityToastVariant } from 'ioiti-ui'
import { useState } from 'react'

const WORDS: Record<VelocityToastVariant, { title: string; description: string }> = {
  default: { title: 'Draft saved', description: 'Nobody else sees it yet.' },
  success: { title: 'Payment received', description: '1,840.00 € from Acme.' },
  warning: { title: 'Stock running low', description: '4 standing desks left.' },
  error: { title: 'Could not reach the printer', description: 'The labels wait in the queue.' },
  info: { title: 'A new version is out', description: 'It is used from the next page you open.' },
}

export default function VelocityToastControlled() {
  const [variant, setVariant] = useState<VelocityToastVariant>('success')
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl
        label="Variant"
        size="sm"
        value={variant}
        onChange={setVariant}
        options={(Object.keys(WORDS) as VelocityToastVariant[]).map((each) => ({ value: each, label: each }))}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Show the toast
        </Button>
        <span className="text-sm text-muted-foreground">{open ? 'Open: its bar runs out in 4 s.' : 'Closed.'}</span>
      </div>
      <VelocityToast
        open={open}
        onDismiss={() => setOpen(false)}
        variant={variant}
        title={WORDS[variant].title}
        description={WORDS[variant].description}
      />
    </div>
  )
}
