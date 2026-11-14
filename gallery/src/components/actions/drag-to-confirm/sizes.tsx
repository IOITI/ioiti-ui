import { DragToConfirm } from 'ioiti-ui'
import { useState } from 'react'

export default function DragToConfirmSizes() {
  const [done, setDone] = useState<string[]>([])
  const confirmed = (what: string) => () => setDone((list) => [...list, what])
  return (
    <div className="grid max-w-md gap-3">
      <DragToConfirm size="sm" actionType="archive" label="Slide to archive" confirmedLabel="Archived" onConfirm={confirmed('archived')} />
      <DragToConfirm size="md" actionType="unlock" label="Slide to unlock" confirmedLabel="Unlocked" onConfirm={confirmed('unlocked')} />
      <DragToConfirm size="lg" actionType="submit" label="Slide to submit" confirmedLabel="Submitted" onConfirm={confirmed('submitted')} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {done.length ? `Done: ${done.join(', ')}.` : 'Nothing confirmed yet.'}
      </p>
    </div>
  )
}
