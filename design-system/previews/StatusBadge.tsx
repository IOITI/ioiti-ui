import { StatusBadge } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-2 p-5">
    <StatusBadge status="ok" />
    <StatusBadge status="warning" />
    <StatusBadge status="down" />
    <StatusBadge status="unknown" />
    <StatusBadge status="disabled" />
    <StatusBadge status="ok" label="Imports running" />
  </div>,
)
