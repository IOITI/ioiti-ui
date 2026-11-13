import { CopyButton } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-3 p-5">
    <CopyButton value="1Z 999 AA1 01 2345 6784" label="Copy the tracking number" />
    <CopyButton value="https://example.com/orders/IT-1042" label="Copy the link" size="sm" />
    <CopyButton value="IT-1042" label="Copy the reference" showLabel size="sm" />
  </div>,
)
