import { Field, NumberInput, SaveBar, ToastProvider, useToast } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

/** A setting changed and not saved: the bar is there until it is saved or discarded. */
function Unsaved() {
  const toast = useToast()
  const [saved, setSaved] = useState(500)
  // Changed already, so that the bar shows: Discard or Save, then change the limit again to bring it back.
  const [limit, setLimit] = useState<number | null>(550)
  const [saving, setSaving] = useState(false)
  const dirty = limit !== saved
  return (
    <div className="flex w-full flex-col gap-4 p-5">
      <Field label="Daily limit" htmlFor="unsaved-limit" className="max-w-xs">
        <NumberInput id="unsaved-limit" value={limit} onChange={setLimit} min={0} step={50} suffix="€" />
      </Field>
      <SaveBar
        open={dirty}
        message="1 unsaved change"
        saving={saving}
        saveDisabled={limit === null}
        error={limit === null && 'The daily limit needs a value: an empty one cannot be saved.'}
        onDiscard={() => setLimit(saved)}
        onSave={() => {
          setSaving(true)
          window.setTimeout(() => {
            setSaved(limit ?? 0)
            setSaving(false)
            toast({ title: 'Saved', variant: 'success' })
          }, 700)
        }}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Unsaved />
  </ToastProvider>,
)
