import { Field, Input } from 'ioiti-ui'

export default function InputStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Field label="Order number" description="Given by the shop: it cannot be changed">
        <Input defaultValue="IT-1042" disabled />
      </Field>
      <Field label="Quantity" error="A whole number, from 1 to 99">
        <Input inputMode="numeric" defaultValue="0" error />
      </Field>
      <Field label="Company name" error="Say which company the invoice is for">
        <Input placeholder="As on its registration" error />
      </Field>
    </div>
  )
}
