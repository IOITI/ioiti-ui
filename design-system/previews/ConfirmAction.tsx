import { Button, ConfirmAction, ToastProvider, useToast } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Confirmations() {
  const toast = useToast()
  const [open, setOpen] = useState<'slide' | 'button' | null>(null)
  const [pending, setPending] = useState(false)
  const close = () => setOpen(null)
  const confirm = () => {
    setPending(true)
    window.setTimeout(() => {
      setPending(false)
      close()
      toast({ title: open === 'slide' ? 'Project deleted' : 'Imports paused', variant: 'success' })
    }, 900)
  }
  return (
    <div className="flex flex-col items-start gap-3 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="destructive" size="sm" leftIcon={<Trash2 />} onClick={() => setOpen('slide')}>
          Delete the project
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpen('button')}>
          Pause the imports
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Press one: a dialog says what will happen, then asks for a slide (what cannot be undone) or a button (the protective direction).
      </p>
      <ConfirmAction
        open={open === 'slide'}
        title="Delete this project"
        description="The project, its 42 files and their history are removed for everyone."
        warning="This cannot be undone."
        confirmLabel="Slide to delete"
        doneLabel="Deleted"
        pending={pending}
        onConfirm={confirm}
        onClose={close}
      />
      <ConfirmAction
        open={open === 'button'}
        gesture="button"
        title="Pause the imports"
        description="No new file is imported until they are resumed; what is under way finishes."
        confirmLabel="Pause the imports"
        pending={pending}
        onConfirm={confirm}
        onClose={close}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Confirmations />
  </ToastProvider>,
)
