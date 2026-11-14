import { Combobox, Field, Input, Select, Textarea } from 'ioiti-ui'
import { Search } from 'lucide-react'
import { useState } from 'react'

const COUNTRIES = [
  { value: 'fr', label: 'France', description: 'Paris' },
  { value: 'de', label: 'Germany', description: 'Berlin' },
  { value: 'it', label: 'Italy', description: 'Rome' },
  { value: 'es', label: 'Spain', description: 'Madrid' },
  { value: 'pt', label: 'Portugal', description: 'Lisbon' },
]

export default function FieldControls() {
  const [country, setCountry] = useState<string | null>('fr')
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Customer">
        <Input placeholder="Name or email" leftIcon={<Search className="size-3.5" />} />
      </Field>
      <Field label="Status">
        <Select
          options={[
            { value: 'open', label: 'Open' },
            { value: 'done', label: 'Done' },
          ]}
          defaultValue="open"
        />
      </Field>
      {/* A Combobox takes its label beside it: htmlFor, and its own id. */}
      <Field label="Country" htmlFor="field-country">
        <Combobox id="field-country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Choose a country" className="w-full" />
      </Field>
      <Field label="Timeout" description="How long a request may take before it is given up">
        <Input inputMode="numeric" defaultValue="250" suffix="ms" />
      </Field>
      <Field label="Note" className="sm:col-span-2">
        <Textarea rows={3} placeholder="What the warehouse should know" />
      </Field>
    </div>
  )
}
