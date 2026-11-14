import { Breadcrumb } from 'ioiti-ui'

export default function BreadcrumbSeparators() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Breadcrumb
        items={[
          { label: 'Customers', href: '/components/tables' },
          { label: 'Atelier Brun', href: '/components/tables/description-list' },
          { label: 'Orders' },
        ]}
      />
      <Breadcrumb
        separator="slash"
        items={[
          { label: 'shared', href: '/components/tables' },
          { label: 'invoices', href: '/components/tables/data-table' },
          { label: '2026-10' },
        ]}
      />
    </div>
  )
}
