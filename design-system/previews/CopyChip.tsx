import { CopyChip } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-3 p-5">
    <CopyChip value="IT-1042" label="the reference" />
    <CopyChip value="4f1c2a7e-9b0d-4d93-a6ff-21c8e5b7a042" label="the request ID" truncate="middle" />
    <CopyChip
      value="https://example.com/webhooks/orders/2026/10/received?source=shop&order=IT-1042"
      label="the address of the webhook"
      truncate="end"
      className="w-72"
    />
  </div>,
)
