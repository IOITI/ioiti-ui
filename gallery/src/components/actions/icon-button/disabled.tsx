import { IconButton } from 'ioiti-ui'
import { Download, Trash2 } from 'lucide-react'

export default function IconButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <IconButton label="Download" icon={<Download />} hint="Nothing to download until the report is ready" disabled />
      <IconButton label="Delete" icon={<Trash2 />} hint="Only an owner can delete it" disabled />
    </div>
  )
}
