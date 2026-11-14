import { Button, ConfirmAction, useToast } from 'ioiti-ui'
import { Pause } from 'lucide-react'
import { useState } from 'react'

export default function ConfirmActionButton() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const confirm = () => {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      setOpen(false)
      toast({ title: 'Imports paused' })
    }, 600)
  }
  return (
    <>
      <Button variant="outline" size="sm" leftIcon={<Pause />} onClick={() => setOpen(true)}>
        Pause the imports
      </Button>
      <ConfirmAction
        open={open}
        gesture="button"
        title="Pause the imports"
        description="No new file is imported until they are resumed; what is under way finishes."
        confirmLabel="Pause the imports"
        pending={pending}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
