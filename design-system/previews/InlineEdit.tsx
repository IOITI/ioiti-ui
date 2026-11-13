import { InlineEdit } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

/** A name and a note edited where they are shown; a name already taken is refused. */
function Editable() {
  const [name, setName] = useState('Spring catalogue print run')
  const [note, setNote] = useState('Proofs approved by the client on 21 Oct.')
  return (
    <div className="flex w-full flex-col gap-2">
      <InlineEdit
        label="Name of the project"
        variant="title"
        value={name}
        validate={(value) => (value.trim() ? undefined : 'A project needs a name.')}
        onSave={async (value) => {
          await new Promise((resolve) => window.setTimeout(resolve, 600))
          if (value.trim().toLowerCase() === 'archive') return 'That name is taken.'
          setName(value)
        }}
      />
      <InlineEdit label="Note" value={note} onSave={setNote} placeholder="Add a note" />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex max-w-xl flex-col gap-3 p-5">
    <Editable />
    <p className="text-xs text-muted-foreground">Press a value to edit it: Enter saves, Escape gives up. Try “archive” as the name.</p>
  </div>,
)
