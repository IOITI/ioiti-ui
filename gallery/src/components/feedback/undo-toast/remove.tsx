import { Button, UndoToast } from 'ioiti-ui'
import { Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'

const FILES = ['invoice-0041.pdf', 'invoice-0042.pdf']

export default function UndoToastRemove() {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState(FILES)
  const [said, setSaid] = useState('')
  // onDismiss comes after an Undo too: the removal is sent only when Undo did not come first.
  const undone = useRef(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <ul className="text-sm" aria-label="Files">
        {files.map((file) => (
          <li key={file} className="font-mono text-xs">
            {file}
          </li>
        ))}
        {files.length === 0 && <li className="text-muted-foreground">No file.</li>}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Trash2 />}
          disabled={open || files.length === 0}
          onClick={() => {
            undone.current = false
            setSaid('')
            setOpen(true)
          }}
        >
          Remove two files
        </Button>
        <Button size="sm" variant="ghost" disabled={open || files.length > 0} onClick={() => setFiles(FILES)}>
          Bring them back
        </Button>
        {said && <span className="text-sm text-muted-foreground">{said}</span>}
      </div>
      <UndoToast
        open={open}
        title="2 files removed"
        description="Removed for good in a few seconds"
        duration={8000}
        onUndo={() => {
          undone.current = true
          setSaid('Kept: nothing was removed.')
        }}
        onDismiss={() => {
          setOpen(false)
          if (!undone.current) {
            setFiles([])
            setSaid('Removed for good.')
          }
        }}
      />
    </div>
  )
}
