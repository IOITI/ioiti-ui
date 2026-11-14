import { Button, Checkbox, ConfirmAction } from 'ioiti-ui'
import { useState } from 'react'

export default function ConfirmActionRefused() {
  const [open, setOpen] = useState<'error' | 'blocked' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [understood, setUnderstood] = useState(false)
  const close = () => {
    setOpen(null)
    setError(null)
    setUnderstood(false)
  }
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={() => setOpen('error')}>
        Send the invoices
      </Button>
      <Button variant="outline" size="sm" onClick={() => setOpen('blocked')}>
        Close the account
      </Button>
      <ConfirmAction
        open={open === 'error'}
        title="Send 12 invoices"
        description="Each customer receives its invoice by email, now."
        confirmLabel="Slide to send"
        error={error}
        onConfirm={() => setError('The mail server did not answer. Nothing was sent: try again in a minute.')}
        onClose={close}
      />
      <ConfirmAction
        open={open === 'blocked'}
        title="Close the account"
        description={
          <div className="space-y-3">
            <p>Its 3 users lose access at once; its data is kept 30 days.</p>
            <Checkbox label="The users have been told" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} />
          </div>
        }
        confirmLabel="Slide to close"
        blocked={!understood}
        onConfirm={close}
        onClose={close}
      />
    </div>
  )
}
