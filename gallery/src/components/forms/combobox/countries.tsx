import { Combobox, Field } from 'ioiti-ui'
import { useState } from 'react'

const COUNTRIES = [
  { value: 'at', label: 'Austria', description: 'Vienna' },
  { value: 'be', label: 'Belgium', description: 'Brussels' },
  { value: 'dk', label: 'Denmark', description: 'Copenhagen' },
  { value: 'fr', label: 'France', description: 'Paris' },
  { value: 'de', label: 'Germany', description: 'Berlin' },
  { value: 'ie', label: 'Ireland', description: 'Dublin' },
  { value: 'it', label: 'Italy', description: 'Rome' },
  { value: 'nl', label: 'Netherlands', description: 'Amsterdam' },
  { value: 'pt', label: 'Portugal', description: 'Lisbon' },
  { value: 'es', label: 'Spain', description: 'Madrid' },
  { value: 'se', label: 'Sweden', description: 'Stockholm' },
]

export default function ComboboxCountries() {
  const [country, setCountry] = useState<string | null>('fr')
  const chosen = COUNTRIES.find((option) => option.value === country)
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Field label="Country of delivery" htmlFor="combobox-country">
        <Combobox id="combobox-country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Choose a country" className="w-full" />
      </Field>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen ? `Chosen: ${chosen.label} (${chosen.value}).` : 'No country chosen.'}
      </p>
    </div>
  )
}
