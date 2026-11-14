import { Field, Select } from 'ioiti-ui'

const PRIORITIES = [
  { value: '', label: 'Choose a priority', disabled: true },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]

export default function SelectStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Currency" description="Set when the account was opened">
        <Select options={[{ value: 'eur', label: 'Euro (EUR)' }]} defaultValue="eur" disabled />
      </Field>
      <Field label="Priority" error="Choose how soon the ticket is answered">
        <Select options={PRIORITIES} defaultValue="" error />
      </Field>
    </div>
  )
}
