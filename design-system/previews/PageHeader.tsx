import { Button, ButtonLink, PageHeader } from 'ioiti-ui'
import { Download, Plus } from 'lucide-react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col gap-8 p-5">
    <PageHeader
      title="Orders"
      description="Every order, newest first."
      actions={<ButtonLink to="#new" size="sm" leftIcon={<Plus />}>New order</ButtonLink>}
    />
    <PageHeader
      title="Invoice 2026-0042"
      description="Sent to Acme on 12 Oct."
      parents={[{ label: 'October', href: '#october' }]}
      actions={<Button size="sm" variant="outline" leftIcon={<Download />}>Download</Button>}
    />
  </div>,
)
