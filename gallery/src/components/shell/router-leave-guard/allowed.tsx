import { ButtonLink, Field, Input, SaveBar } from 'ioiti-ui'
import { RouterLeaveGuard } from 'ioiti-ui/react-router'
import { useState } from 'react'

export default function RouterLeaveGuardAllowed() {
  const [saved, setSaved] = useState('Leave it at the back door.')
  const [note, setNote] = useState(saved)
  const dirty = note !== saved
  return (
    <div className="flex flex-col gap-4">
      <Field label="Note to the carrier" htmlFor="carrier-note" className="max-w-md">
        <Input id="carrier-note" value={note} onChange={(event) => setNote(event.target.value)} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink to="/patterns/sign-in" variant="outline" size="sm">
          The sign-in page: let through
        </ButtonLink>
        <ButtonLink to="/components/forms" variant="outline" size="sm">
          The forms: asks first
        </ButtonLink>
      </div>
      <SaveBar open={dirty} message="The note is not saved" onDiscard={() => setNote(saved)} onSave={() => setSaved(note)} />
      <RouterLeaveGuard
        when={dirty}
        // Where a lapsed session is sent: staying would save nothing. (`within="/orders/42"` would let the page's
        // own views go too, /orders/42/items and /orders/42/notes sharing one draft.)
        allowed={(pathname) => pathname === '/patterns/sign-in'}
        title="Leave the note unsaved?"
        message="What you wrote to the carrier is lost if you leave this page."
        stayLabel="Keep writing"
        leaveLabel="Leave it"
      />
    </div>
  )
}
