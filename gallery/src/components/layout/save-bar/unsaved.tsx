import { Field, NumberInput, SaveBar, useToast } from 'ioiti-ui'
import { useState } from 'react'

export default function SaveBarUnsaved() {
  const toast = useToast()
  const [saved, setSaved] = useState(500)
  const [limit, setLimit] = useState<number | null>(500)
  const [saving, setSaving] = useState(false)
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
      <Field label="Daily limit" description="Change it, or empty it." htmlFor="unsaved-limit" className="max-w-xs">
        <NumberInput id="unsaved-limit" value={limit} onChange={setLimit} min={0} step={50} suffix="€" />
      </Field>
      <SaveBar
        open={limit !== saved}
        message="1 unsaved change"
        saving={saving}
        saveDisabled={limit === null}
        error={limit === null && 'The daily limit needs a value: an empty one cannot be saved.'}
        onDiscard={() => setLimit(saved)}
        onSave={save}
      />
    </div>
  )
}
