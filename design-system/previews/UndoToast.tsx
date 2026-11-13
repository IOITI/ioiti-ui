import { Button, UndoToast } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function Preview() {
  // Open on load: a removal has just been made.
  const [open, setOpen] = useState(true)
  const [restored, setRestored] = useState(false)
  return (
    <div className="flex min-h-[12rem] flex-col items-start gap-2 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRestored(false)
            setOpen(true)
          }}
        >
          Remove two files
        </Button>
        {restored && <span className="text-xs text-muted-foreground">Kept: nothing was removed.</span>}
      </div>
      <span className="text-xs text-muted-foreground">Nothing is sent before its time runs out; Undo takes it back.</span>
      <UndoToast
        open={open}
        title="2 files removed"
        description="Removed for good in a few seconds"
        duration={8000}
        onUndo={() => setRestored(true)}
        onDismiss={() => setOpen(false)}
      />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
