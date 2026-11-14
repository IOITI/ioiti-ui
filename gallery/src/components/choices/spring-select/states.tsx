import { SpringSelect } from 'ioiti-ui'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

export default function SpringSelectStates() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <SpringSelect label="Language of the invoices" placeholder="Choose a language" options={LANGUAGES} />
      <SpringSelect label="Language of the emails" placeholder="Choose a language" options={LANGUAGES} error="Choose the language the customer reads" />
      <SpringSelect label="Language of the account" defaultValue="en" options={LANGUAGES} disabled />
    </div>
  )
}
