import { CodeEditor } from 'ioiti-ui/code'
import { useState } from 'react'

export default function CodeEditorEmpty() {
  const [note, setNote] = useState('')
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <CodeEditor
        label="Release note"
        language="markdown"
        value={note}
        onChange={setNote}
        placeholder="What changed, for the people who use it…"
        lineNumbers={false}
        minHeight={120}
        maxHeight={240}
      />
      <span className="text-xs text-muted-foreground tabular-nums">{note.trim() ? `${note.trim().split(/\s+/).length} words` : 'Nothing written yet'}</span>
    </div>
  )
}
