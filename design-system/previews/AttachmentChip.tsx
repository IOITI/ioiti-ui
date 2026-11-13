import { AttachmentChip } from 'ioiti-ui'
import { FileText, FlaskConical } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap gap-2 p-5">
    <AttachmentChip label="October.csv" detail="12 kB" icon={<FileText />} onRemove={() => {}} />
    <AttachmentChip label="Run of the slower line" icon={<FlaskConical />} href="#attachment-chip" />
    <AttachmentChip label="chart-2026-10-30.png" detail="Uploading…" busy onRemove={() => {}} />
    <AttachmentChip label="statement.pdf" detail="Larger than 5 MB" tone="danger" onRemove={() => {}} />
  </div>,
)
