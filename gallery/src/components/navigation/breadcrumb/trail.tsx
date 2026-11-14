import { Breadcrumb } from 'ioiti-ui'
import { House } from 'lucide-react'

export default function BreadcrumbTrail() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/', icon: <House /> },
        { label: 'Components', href: '/components' },
        { label: 'Navigation', href: '/components/navigation' },
        { label: 'Breadcrumb' },
      ]}
    />
  )
}
