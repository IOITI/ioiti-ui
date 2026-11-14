import { Button, SettleModal } from 'ioiti-ui'
import { useState } from 'react'

export default function SettleModalDecision() {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const choose = (choice: string) => {
    setAnswer(choice)
    setOpen(false)
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Leave the draft
      </Button>
      {answer && <span className="text-sm text-muted-foreground">Chosen: {answer}.</span>}
      {/* A choice to make: no ×, and a click beside it does not close it. Escape still does. */}
      <SettleModal
        open={open}
        onClose={() => setOpen(false)}
        hideCloseButton
        closeOnBackdrop={false}
        size="sm"
        title="Keep the draft?"
        description="The order has three lines not sent yet."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => choose('throw it away')}>
              Throw it away
            </Button>
            <Button size="sm" onClick={() => choose('keep it')}>
              Keep it
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">A draft kept waits here for 30 days.</p>
      </SettleModal>
    </div>
  )
}
