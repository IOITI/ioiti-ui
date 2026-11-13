import { Breadcrumb } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col items-start gap-3 p-5">
    <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Components', href: '#' }, { label: 'Navigation' }]} />
    <Breadcrumb
      separator="slash"
      maxItems={3}
      items={[
        { label: 'Home', href: '#' },
        { label: 'Customers', href: '#' },
        { label: 'Acme', href: '#' },
        { label: 'Orders', href: '#' },
        { label: '2026-0042' },
      ]}
    />
  </div>,
)
