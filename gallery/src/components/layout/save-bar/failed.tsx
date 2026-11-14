import { Field, Input, SaveBar, useToast } from 'ioiti-ui'
import { useState } from 'react'

export default function SaveBarFailed() {
  const toast = useToast()
  const [saved, setSaved] = useState('shop@example.com')
  // Typed, not saved yet.
  const [sender, setSender] = useState('orders@example.com')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tries, setTries] = useState(0)
  const save = () => {
    setSaving(true)
    setError(null)
    window.setTimeout(() => {
      setSaving(false)
      setTries((was) => was + 1)
      // The first try fails, as a server that did not answer; the next one goes through.
      if (tries === 0) {
        setError('The server did not answer: nothing was saved. Try again in a moment.')
        return
      }
      setSaved(sender)
      toast({ title: 'Sender changed', variant: 'success' })
    }, 700)
  }
  return (
    <div className="flex flex-col gap-4">
      <Field label="Sender of the order emails" htmlFor="failed-sender" className="max-w-sm">
        <Input id="failed-sender" type="email" value={sender} onChange={(event) => setSender(event.target.value)} />
      </Field>
      <SaveBar
        open={sender !== saved}
        message="The sender changed"
        saving={saving}
        error={error}
        onDiscard={() => {
          setSender(saved)
          setError(null)
        }}
        onSave={save}
        saveLabel={error ? 'Try again' : 'Save'}
      />
    </div>
  )
}
