import { AttachmentChip, Button, PromptComposer } from 'ioiti-ui'
import { ChevronDown, FileText, Gauge, Paperclip } from 'lucide-react'
import { useState } from 'react'

export default function PromptComposerAttachments() {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  // What the request goes with: a file dropped on the frame or pasted into the field joins them.
  const [attached, setAttached] = useState<string[]>(['October.csv'])
  const add = (names: string[]) => setAttached([...attached, ...names.filter((name) => !attached.includes(name))])
  return (
    <div className="space-y-3">
      <PromptComposer
        label="Ask the assistant"
        value={value}
        onValueChange={setValue}
        attachments={
          attached.length > 0
            ? attached.map((name) => (
                <AttachmentChip
                  key={name}
                  label={name}
                  detail="12 kB"
                  icon={<FileText />}
                  onRemove={() => setAttached(attached.filter((other) => other !== name))}
                />
              ))
            : undefined
        }
        onFiles={(files) => add(files.map((file) => file.name))}
        onSubmit={(text) => {
          setSent([text, ...attached].join(' · '))
          setBusy(true)
          setValue('')
          window.setTimeout(() => setBusy(false), 2500)
        }}
        onStop={() => setBusy(false)}
        busy={busy}
        maxLength={2000}
        footer="about 2 cents a question"
        controls={
          // Four of them, as an assistant's composer has: on a phone they wrap rather than run under the button.
          <>
            <Button size="sm" variant="ghost" leftIcon={<Paperclip className="size-3.5" />} aria-label="Attach" onClick={() => add([`Note ${attached.length + 1}.txt`])} />
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
      <p className="text-xs text-muted-foreground">Sent: {sent ?? 'nothing yet'}</p>
    </div>
  )
}
