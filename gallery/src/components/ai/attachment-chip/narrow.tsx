import { AttachmentChip } from 'ioiti-ui'
import { FileSpreadsheet, FileText } from 'lucide-react'

export default function AttachmentChipNarrow() {
  return (
    // Its label is cut where room ends; its size and its remove button stay whole.
    <div className="flex max-w-64 flex-wrap gap-2 rounded-xl border border-dashed border-border p-3">
      <AttachmentChip label="Orders of the north shop, October 2026, with refunds.xlsx" detail="1.2 MB" icon={<FileSpreadsheet />} onRemove={() => {}} />
      <AttachmentChip label="Delivery terms for the partners, signed copy.pdf" detail="340 kB" icon={<FileText />} onRemove={() => {}} />
    </div>
  )
}
