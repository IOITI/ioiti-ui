import { Badge } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-wrap items-center gap-2 p-5">
    <Badge>Neutral</Badge>
    <Badge tone="success">Paid</Badge>
    <Badge tone="warning">Held</Badge>
    <Badge tone="danger">Refused</Badge>
    <Badge variant="outline">Draft</Badge>
    <Badge variant="solid">New</Badge>
    <Badge tone="success" variant="solid">Live</Badge>
    <Badge tone="danger" variant="outline">Overdue</Badge>
  </div>,
)
