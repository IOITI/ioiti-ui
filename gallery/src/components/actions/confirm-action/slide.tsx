import { Button, ConfirmAction, useToast } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function ConfirmActionSlide() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const confirm = () => {
    setPending(true)
    // The request, answered after a moment.
    window.setTimeout(() => {
      setPending(false)
      setOpen(false)
      toast({ title: 'Project deleted', variant: 'success' })
    }, 900)
  }
  return (
    <>
      <Button variant="destructive" size="sm" leftIcon={<Trash2 />} onClick={() => setOpen(true)}>
        Delete the project
      </Button>
      <ConfirmAction
        open={open}
        title="Delete this project"
        description="The project, its 42 files and their history are removed for everyone."
        warning="This cannot be undone."
        confirmLabel="Slide to delete"
        doneLabel="Deleted"
        pending={pending}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
