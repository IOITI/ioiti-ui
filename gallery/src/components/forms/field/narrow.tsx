import { Field, Input, Select } from 'ioiti-ui'

export default function FieldNarrow() {
  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl border border-dashed border-border p-3">
      <Field label="Address the parcels are sent back to when no one is there to receive them">
        <Input placeholder="Street, number, town" />
      </Field>
      <Field
        label="Delivery window"
        description="The hours the warehouse may deliver in, from Monday to Friday; on a public holiday, the next working day's."
      >
        <Select
          options={[
            { value: 'morning', label: 'Morning, from 8:00 to 12:00' },
            { value: 'afternoon', label: 'Afternoon, from 13:00 to 18:00' },
          ]}
          defaultValue="morning"
        />
      </Field>
      <Field label="Website" error="An address the browser can open: example.com/shop">
        <Input defaultValue="example" prefix="https://" error />
      </Field>
    </div>
  )
}
