import { Breadcrumb } from 'ioiti-ui'

const TRAIL = [
  { label: 'Home', href: '/' },
  { label: 'Customers', href: '/components/tables' },
  { label: 'Atelier Brun', href: '/components/tables/description-list' },
  { label: 'Orders', href: '/components/tables/data-table' },
  { label: '2026-0042', href: '/components/tables/interactive-timeline' },
  { label: 'Delivery' },
]

export default function BreadcrumbFolded() {
  return (
    <div className="flex flex-col items-start gap-3">
      {/* Four steps kept by default: the first, then the last two. */}
      <Breadcrumb items={TRAIL} />
      <Breadcrumb items={TRAIL} maxItems={3} separator="slash" />
    </div>
  )
}
