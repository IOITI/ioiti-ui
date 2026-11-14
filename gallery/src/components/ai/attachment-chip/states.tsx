import { AttachmentChip, Button } from 'ioiti-ui'
import { FileText, FlaskConical } from 'lucide-react'
import { useState } from 'react'

const ALL = ['ready', 'link', 'uploading', 'refused', 'plain'] as const

export default function AttachmentChipStates() {
  const [shown, setShown] = useState<readonly string[]>(ALL)
  const remove = (which: string) => setShown(shown.filter((other) => other !== which))
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Taken: it can be removed. */}
        {shown.includes('ready') && <AttachmentChip label="October.csv" detail="12 kB" icon={<FileText />} onRemove={() => remove('ready')} />}
        {/* A record: its label leads to it. */}
        {shown.includes('link') && <AttachmentChip label="Comparison of two shops" icon={<FlaskConical />} href="/components/ai/ai-agent-activity" />}
        {/* Made ready: a spinner in place of its icon. */}
        {shown.includes('uploading') && <AttachmentChip label="chart-2026-10-30.png" detail="Uploading…" busy onRemove={() => remove('uploading')} />}
        {/* Not taken, and why. */}
        {shown.includes('refused') && <AttachmentChip label="statement.pdf" detail="Larger than 5 MB" tone="danger" onRemove={() => remove('refused')} />}
        {/* Nothing to do with it: a paperclip, by default. */}
        {shown.includes('plain') && <AttachmentChip label="notes.txt" />}
      </div>
      {shown.length < ALL.length && (
        <Button size="xs" variant="ghost" onClick={() => setShown(ALL)}>
          Put them back
        </Button>
      )}
    </div>
  )
}
