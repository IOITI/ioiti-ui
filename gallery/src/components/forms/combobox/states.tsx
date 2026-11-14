import { Combobox, Field } from 'ioiti-ui'

const TEAMS = [
  { value: 'billing', label: 'Billing' },
  { value: 'deliveries', label: 'Deliveries' },
  { value: 'support', label: 'Support' },
]

export default function ComboboxStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Team" htmlFor="combobox-team" description="Only an owner moves a user to another team">
        <Combobox id="combobox-team" options={TEAMS} defaultValue="support" disabled className="w-full" />
      </Field>
      <Field label="Answered by" htmlFor="combobox-answered" error="Choose the team that answers the ticket">
        <Combobox id="combobox-answered" options={TEAMS} placeholder="Choose a team" className="w-full" />
      </Field>
    </div>
  )
}
