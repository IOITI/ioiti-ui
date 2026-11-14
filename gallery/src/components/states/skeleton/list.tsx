import { Avatar, Button, SkeletonAvatar, SkeletonReveal, SkeletonText } from 'ioiti-ui'
import { useState } from 'react'

const CUSTOMERS = [
  { name: 'Acme', detail: '14 orders · 18,420.00 €' },
  { name: 'Globex', detail: '9 orders · 6,105.50 €' },
  { name: 'Initech', detail: '3 orders · 912.00 €' },
]

export default function SkeletonList() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="max-w-sm space-y-3">
      <Button size="sm" variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? 'Show what loaded' : 'Load again'}
      </Button>
      {/* As many rows as will come, each as high as a row: the list does not jump. */}
      <SkeletonReveal
        loading={loading}
        skeleton={
          <ul className="divide-y divide-border rounded-xl border border-border">
            {CUSTOMERS.map((customer) => (
              <li key={customer.name} className="flex items-center gap-3 px-4 py-3">
                <SkeletonAvatar size={32} />
                <SkeletonText lines={2} className="flex-1" />
              </li>
            ))}
          </ul>
        }
      >
        <ul className="divide-y divide-border rounded-xl border border-border" aria-label="Customers">
          {CUSTOMERS.map((customer) => (
            <li key={customer.name} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={customer.name} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </SkeletonReveal>
    </div>
  )
}
