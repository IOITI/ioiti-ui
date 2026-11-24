import { Button, UndoToast } from 'ioiti-ui'
import type { StatusTone } from 'ioiti-ui'
import { Archive } from 'lucide-react'
import { useState } from 'react'

const TONES: { tone: StatusTone; title: string; description: string }[] = [
  { tone: 'neutral', title: 'Order IT-1042 deleted', description: 'Deleted for good in a few seconds' },
  { tone: 'success', title: 'Invoice marked as paid', description: 'Its customer is told in a few seconds' },
  { tone: 'warning', title: 'Price lowered by 40 %', description: 'Applied to the shop in a few seconds' },
  { tone: 'danger', title: 'Customer blocked', description: 'Their orders stop in a few seconds' },
  { tone: 'info', title: 'Moved to the spring catalogue', description: 'Published in a few seconds' },
]

export default function UndoToastVariants() {
  const [open, setOpen] = useState<'tone' | 'archive' | null>(null)
  // The last one chosen: its words stay while it leaves.
  const [chosen, setChosen] = useState(TONES[0])
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TONES.map((each) => (
        <Button
          key={each.tone}
          size="sm"
          variant="outline"
          onClick={() => {
            setChosen(each)
            setOpen('tone')
          }}
        >
          {each.tone}
        </Button>
      ))}
      <Button size="sm" variant="outline" leftIcon={<Archive />} onClick={() => setOpen('archive')}>
        Its own words and icon
      </Button>
      <UndoToast
        key={chosen.tone}
        open={open === 'tone'}
        tone={chosen.tone}
        title={chosen.title}
        description={chosen.description}
        onDismiss={() => setOpen(null)}
      />
      <UndoToast
        open={open === 'archive'}
        icon={<Archive className="size-4 text-muted-foreground" />}
        title="12 deliveries archived"
        description="Out of the list in a few seconds"
        undoLabel="Keep them"
        restoredMessage="Kept in the list"
        onDismiss={() => setOpen(null)}
      />
    </div>
  )
}
