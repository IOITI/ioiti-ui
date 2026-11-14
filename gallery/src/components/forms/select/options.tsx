import { Field, Select } from 'ioiti-ui'

export default function SelectOptions() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Status">
        <Select
          options={[
            { value: 'open', label: 'Open' },
            { value: 'waiting', label: 'Waiting for the customer' },
            { value: 'done', label: 'Done' },
            { value: 'archived', label: 'Archived (by an owner only)', disabled: true },
          ]}
          defaultValue="open"
        />
      </Field>
      <Field label="Carrier">
        {/* The first option asks for a choice, and cannot be chosen back. */}
        <Select
          options={[
            { value: '', label: 'Choose a carrier', disabled: true },
            { value: 'road', label: 'Road freight' },
            { value: 'post', label: 'Post' },
            { value: 'courier', label: 'Courier' },
          ]}
          defaultValue=""
          required
        />
      </Field>
    </div>
  )
}
