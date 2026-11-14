import { Button, Field, Input, SettleModal, useToast } from 'ioiti-ui'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

export default function SettleModalForm() {
  const toast = useToast()
  const [name, setName] = useState('Spring catalogue')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(name)
  const [saving, setSaving] = useState(false)
  const error = draft.trim() === '' ? 'A name, of one word at least' : draft.length > 40 ? '40 characters at most' : undefined
  const save = () => {
    if (error) return
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      setName(draft.trim())
      setOpen(false)
      toast({ title: 'Project renamed', variant: 'success' })
    }, 700)
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium">{name}</span>
      <Button
        size="sm"
        variant="outline"
        leftIcon={<Pencil />}
        onClick={() => {
          setDraft(name)
          setOpen(true)
        }}
      >
        Rename
      </Button>
      <SettleModal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Rename the project"
        description="Its address stays the same: links to it keep working."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" form="rename-project" disabled={Boolean(error)} isLoading={saving} loadingText="Renaming">
              Rename
            </Button>
          </>
        }
      >
        <form
          id="rename-project"
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <Field label="Name" error={error}>
            <Input value={draft} error={Boolean(error)} onChange={(event) => setDraft(event.target.value)} />
          </Field>
        </form>
      </SettleModal>
    </div>
  )
}
