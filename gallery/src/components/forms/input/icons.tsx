import { Field, Input } from 'ioiti-ui'
import { Lock, Mail, Search } from 'lucide-react'
import { useState } from 'react'

const SERVICES = ['Billing', 'Deliveries', 'Imports', 'Invoices', 'Notifications', 'Search index']

export default function InputIcons() {
  const [query, setQuery] = useState('')
  const found = SERVICES.filter((service) => service.toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Field label="Services">
          <Input
            type="search"
            placeholder="Find a service"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            leftIcon={<Search className="size-3.5" />}
          />
        </Field>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {found.length} of {SERVICES.length} services{found.length ? `: ${found.join(', ')}` : ''}.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Field label="Send the invoice to">
          <Input type="email" placeholder="billing@example.com" leftIcon={<Mail className="size-3.5" />} />
        </Field>
        <Field label="Account" description="Given when the account was opened: it cannot be changed">
          <Input defaultValue="ACC-20931" readOnly rightIcon={<Lock className="size-3.5" />} />
        </Field>
      </div>
    </div>
  )
}
