import { Breadcrumb } from 'ioiti-ui'
import { House } from 'lucide-react'

export default function BreadcrumbOneLine() {
  return (
    <div className="max-w-sm rounded-xl border border-dashed border-border p-3">
      <Breadcrumb
        wrap={false}
        items={[
          { label: 'Home', href: '/', icon: <House /> },
          { label: 'Customers', href: '/components/tables' },
          { label: 'Atelier Brun, stationery and office furniture', href: '/components/tables/description-list' },
          { label: 'Order 2026-0042, delivered in three boxes' },
        ]}
      />
    </div>
  )
}
