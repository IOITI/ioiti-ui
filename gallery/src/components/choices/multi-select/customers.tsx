import { Field, MultiSelect } from 'ioiti-ui'
import { useState } from 'react'

const CUSTOMERS = [
  { value: 'brun', label: 'Atelier Brun', description: 'Lyon', group: 'Regulars' },
  { value: 'acme', label: 'Acme', description: 'Paris', group: 'Regulars' },
  { value: 'nord', label: 'Nord Logistique', description: 'Lille', group: 'Regulars' },
  { value: 'vega', label: 'Vega Studio', description: 'Berlin', group: 'New this month' },
  { value: 'lumen', label: 'Lumen & Co', description: 'Rome', group: 'New this month' },
  { value: 'old', label: 'Maison Ancienne', description: 'Closed', group: 'New this month', disabled: true },
]

export default function MultiSelectCustomers() {
  const [chosen, setChosen] = useState<string[]>(['brun', 'acme', 'vega'])
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Field label="Customers" htmlFor="multi-customers">
        <MultiSelect id="multi-customers" options={CUSTOMERS} value={chosen} onChange={setChosen} maxChips={2} placeholder="Choose customers" />
      </Field>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen.length
          ? `Chosen: ${CUSTOMERS.filter((customer) => chosen.includes(customer.value))
              .map((customer) => customer.label)
              .join(', ')}.`
          : 'No customer chosen.'}
      </p>
    </div>
  )
}
