import { Field, MultiSelect } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const CUSTOMERS = [
  { value: 'brun', label: 'Atelier Brun', description: 'Lyon', group: 'Regulars' },
  { value: 'acme', label: 'Acme', description: 'Paris', group: 'Regulars' },
  { value: 'nord', label: 'Nord Logistique', description: 'Lille', group: 'Regulars' },
  { value: 'vega', label: 'Vega Studio', description: 'Berlin', group: 'New this month' },
  { value: 'lumen', label: 'Lumen & Co', description: 'Rome', group: 'New this month' },
  { value: 'old', label: 'Maison Ancienne', description: 'Closed', group: 'New this month', disabled: true },
]

/** Tags typed as they come: what is not in the list becomes one. */
function Tags() {
  const [options, setOptions] = useState([
    { value: 'urgent', label: 'urgent' },
    { value: 'gift', label: 'gift' },
    { value: 'fragile', label: 'fragile' },
  ])
  return (
    <Field label="Tags" htmlFor="order-tags">
      <MultiSelect
        id="order-tags"
        options={options}
        defaultValue={['urgent']}
        placeholder="Add a tag"
        onCreateOption={(text) => {
          setOptions((now) => [...now, { value: text, label: text }])
          return text
        }}
      />
    </Field>
  )
}

createRoot(document.getElementById('root')!).render(
  <div className="flex flex-col gap-3 p-5">
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Customers" htmlFor="customers">
        <MultiSelect id="customers" options={CUSTOMERS} defaultValue={['brun', 'acme', 'vega']} maxChips={2} placeholder="Choose customers" />
      </Field>
      <Tags />
    </div>
    <p className="text-xs text-muted-foreground">Type in a field: the list opens under it, filtered. In Tags, what is not in the list becomes a tag.</p>
  </div>,
)
