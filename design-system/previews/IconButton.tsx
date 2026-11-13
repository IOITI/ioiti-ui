import { IconButton } from 'ioiti-ui'
import { Archive, Copy, Download } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-3 p-5">
    <IconButton label="Copy the link" icon={<Copy />} />
    <IconButton label="Archive" icon={<Archive />} hint="Archive the project (it stays readable)" />
    <IconButton label="Download" icon={<Download />} disabled />
  </div>,
)
