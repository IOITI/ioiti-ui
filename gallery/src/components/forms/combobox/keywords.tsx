import { Combobox, Field } from 'ioiti-ui'
import { DollarSign, Euro, JapaneseYen, PoundSterling, SwissFranc } from 'lucide-react'

const CURRENCIES = [
  { value: 'EUR', label: 'Euro', description: 'EUR', icon: <Euro />, keywords: ['eur', 'europe'] },
  { value: 'USD', label: 'US dollar', description: 'USD', icon: <DollarSign />, keywords: ['usd', 'dollar', 'united states'] },
  { value: 'GBP', label: 'Pound sterling', description: 'GBP', icon: <PoundSterling />, keywords: ['gbp', 'pound', 'united kingdom'] },
  { value: 'CHF', label: 'Swiss franc', description: 'CHF', icon: <SwissFranc />, keywords: ['chf', 'franc', 'switzerland'] },
  { value: 'JPY', label: 'Japanese yen', description: 'JPY', icon: <JapaneseYen />, keywords: ['jpy', 'yen', 'japan'] },
]

export default function ComboboxKeywords() {
  return (
    <div className="w-full max-w-sm">
      <Field label="Currency of the invoice" htmlFor="combobox-currency">
        <Combobox
          id="combobox-currency"
          options={CURRENCIES}
          defaultValue="EUR"
          searchPlaceholder="A currency, or its code"
          emptyText="No currency of that name."
          className="w-full"
        />
      </Field>
    </div>
  )
}
