import { Field, MultiSelect } from 'ioiti-ui'

const CARRIERS = [
  { value: 'road', label: 'Road freight' },
  { value: 'post', label: 'Post' },
  { value: 'courier', label: 'Courier' },
]

export default function MultiSelectStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Carriers" htmlFor="multi-carriers" description="Chosen by the account's owner">
        <MultiSelect id="multi-carriers" options={CARRIERS} defaultValue={['road', 'post']} disabled />
      </Field>
      <Field label="Carriers for returns" htmlFor="multi-returns" error="One carrier at least">
        <MultiSelect id="multi-returns" options={CARRIERS} placeholder="Choose carriers" error />
      </Field>
    </div>
  )
}
