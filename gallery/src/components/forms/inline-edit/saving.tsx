import { InlineEdit } from 'ioiti-ui'
import { useState } from 'react'

export default function InlineEditSaving() {
  const [name, setName] = useState('Spring catalogue print run')
  const [note, setNote] = useState('Proofs approved by the client on 21 Oct.')
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <InlineEdit
        label="Name of the project"
        variant="title"
        value={name}
        validate={(value) => (value.trim() ? undefined : 'A project needs a name.')}
        onSave={async (value) => {
          // The request, answered after a moment: a name already taken is refused.
          await new Promise((resolve) => window.setTimeout(resolve, 600))
          if (value.trim().toLowerCase() === 'archive') return 'That name is taken.'
          setName(value)
        }}
      />
      <InlineEdit label="Note" value={note} onSave={setNote} placeholder="Add a note" />
    </div>
  )
}
