import { Checkbox } from 'ioiti-ui'

export default function CheckboxDescriptions() {
  return (
    <div className="flex w-full flex-wrap gap-x-12 gap-y-6">
      <div className="flex flex-col gap-3">
        <Checkbox label="Keep me signed in" description="On this browser only" defaultChecked />
        <Checkbox label="Send a copy to the warehouse" description="Each invoice, as a PDF, to the address of the warehouse that ships it" />
      </div>
      <div className="flex flex-col gap-3">
        <Checkbox label="Share usage data" description="Turned off by the administrator" disabled />
        <Checkbox label="Archived" description="An archived order cannot be reopened" defaultChecked disabled />
      </div>
    </div>
  )
}
