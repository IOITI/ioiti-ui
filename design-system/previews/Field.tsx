import { Combobox, Field, Input, Select, Textarea } from 'ioiti-ui'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const COUNTRIES = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
]

function Preview() {
  const [country, setCountry] = useState('fr')
  return (
    <div className="grid w-full gap-4 p-5 sm:grid-cols-2">
      <Field label="Customer">
        <Input placeholder="Name or email" leftIcon={<Search className="size-3.5" />} />
      </Field>
      <Field label="Quantity" error="A whole number, from 1 to 99">
        <Input type="number" defaultValue="0" error />
      </Field>
      <Field label="Timeout" description="How long a request may take before it is given up">
        <Input inputMode="numeric" defaultValue="250" suffix="ms" />
      </Field>
      <Field label="Website">
        <Input defaultValue="example.com" prefix="https://" />
      </Field>
      <Field label="Status">
        <Select options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} defaultValue="open" />
      </Field>
      <Field label="Country" htmlFor="country">
        <Combobox id="country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Choose a country" className="w-full" />
      </Field>
      <Field label="Note" className="sm:col-span-2">
        <Textarea rows={3} placeholder="What the warehouse should know" />
      </Field>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
