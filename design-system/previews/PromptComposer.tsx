import { AttachmentChip, Button, PromptComposer } from 'ioiti-ui'
import { ChevronDown, FileText, Gauge, Paperclip } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

// It floats at the foot of what scrolls under it, with no band behind it.
function FloatingComposer() {
  const [value, setValue] = useState('')
  return (
    <div className="relative h-72 overflow-y-auto rounded-2xl border border-border/70 px-4 pt-4">
      <div className="space-y-3 text-sm text-muted-foreground">
        {Array.from({ length: 9 }, (_, index) => (
          <p key={index}>
            Line {index + 1} of the conversation: what was asked, what the assistant did and what it answered, scrolling under the field that floats over it.
          </p>
        ))}
      </div>
      <div className="sticky bottom-3 mt-4">
        <PromptComposer label="Ask again" hideLabel value={value} onValueChange={setValue} onSubmit={() => setValue('')} placeholder="Ask again…" floating />
      </div>
    </div>
  )
}

function Composer() {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  // What the request goes with: a file dropped on the frame or pasted into the field joins them.
  const [attached, setAttached] = useState<string[]>(['October.csv'])
  return (
    <PromptComposer
      label="Ask the assistant"
      value={value}
      onValueChange={setValue}
      attachments={
        attached.length > 0
          ? attached.map((name) => (
              <AttachmentChip key={name} label={name} detail="12 kB" icon={<FileText />} onRemove={() => setAttached(attached.filter((other) => other !== name))} />
            ))
          : undefined
      }
      onFiles={(files) => setAttached([...attached, ...files.map((file) => file.name).filter((name) => !attached.includes(name))])}
      onSubmit={() => {
        setBusy(true)
        setValue('')
        window.setTimeout(() => setBusy(false), 2500)
      }}
      onStop={() => setBusy(false)}
      busy={busy}
      maxLength={2000}
      footer="about 2 cents a question"
      controls={
        <>
          <Button size="sm" variant="ghost" leftIcon={<Paperclip className="size-3.5" />} aria-label="Attach" onClick={() => setAttached([...attached, `Note ${attached.length + 1}.txt`])} />
          <Button size="sm" variant="ghost" rightIcon={<ChevronDown className="size-3.5" />}>
            Model 2
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ChevronDown className="size-3.5" />}>
            high
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Gauge className="size-3.5" />} aria-label="Context: 12,200 tokens">
            <span className="tabular-nums">12.2k · 1%</span>
          </Button>
        </>
      }
      suggestions={[
        { label: 'Summarise', prompt: 'Summarise October in three lines.' },
        { label: 'Compare', prompt: 'Compare October with September.' },
      ]}
    />
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="block w-full p-5">
    <Composer />
    <div className="mt-4">
      <FloatingComposer />
    </div>
  </div>,
)
