import { ButtonLink, Field, NumberInput, SaveBar, useToast } from 'ioiti-ui'
import { RouterLeaveGuard } from 'ioiti-ui/react-router'
import { useState } from 'react'

export default function RouterLeaveGuardUnsaved() {
  const toast = useToast()
  const [saved, setSaved] = useState(500)
  const [limit, setLimit] = useState<number | null>(500)
  const [saving, setSaving] = useState(false)
  const dirty = limit !== saved
  const save = () => {
    setSaving(true)
    window.setTimeout(() => {
      setSaved(limit ?? 0)
      setSaving(false)
      toast({ title: 'Saved', variant: 'success' })
    }, 700)
  }
  return (
    <div className="flex flex-col gap-4">
      <Field label="Daily limit" htmlFor="guarded-limit" className="max-w-xs">
        <NumberInput id="guarded-limit" value={limit} onChange={setLimit} min={0} step={50} suffix="€" />
      </Field>
      <p className="text-sm text-muted-foreground">
        Change it, then go to{' '}
        <ButtonLink to="/components/forms" variant="link">
          the forms
        </ButtonLink>
        : the page asks first.
      </p>
      <SaveBar
        open={dirty}
        message="1 unsaved change"
        saving={saving}
        saveDisabled={limit === null}
        error={limit === null && 'The daily limit needs a value: an empty one cannot be saved.'}
        onDiscard={() => setLimit(saved)}
        onSave={save}
      />
      {/* The same `when` as the bar's: there is something to lose. */}
      <RouterLeaveGuard when={dirty} />
    </div>
  )
}
