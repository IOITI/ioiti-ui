import { Button, SegmentedControl, Toast } from 'ioiti-ui'
import type { StatusTone } from 'ioiti-ui'
import { useState } from 'react'

const WORDS: Record<StatusTone, { title: string; description: string }> = {
  neutral: { title: 'Draft saved', description: 'Nobody else sees it yet.' },
  success: { title: 'Payment received', description: '1,840.00 € from Acme.' },
  warning: { title: 'Stock running low', description: '4 standing desks left.' },
  danger: { title: 'Could not reach the printer', description: 'The labels wait in the queue.' },
  info: { title: 'A new version is out', description: 'It is used from the next page you open.' },
}

export default function ToastControlled() {
  const [tone, setTone] = useState<StatusTone>('success')
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl
        label="Tone"
        size="sm"
        value={tone}
        onChange={setTone}
        options={(Object.keys(WORDS) as StatusTone[]).map((each) => ({ value: each, label: each }))}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Show the toast
        </Button>
        <span className="text-sm text-muted-foreground">{open ? 'Open: its bar runs out in 4 s.' : 'Closed.'}</span>
      </div>
      <Toast
        open={open}
        onDismiss={() => setOpen(false)}
        tone={tone}
        title={WORDS[tone].title}
        description={WORDS[tone].description}
      />
    </div>
  )
}
