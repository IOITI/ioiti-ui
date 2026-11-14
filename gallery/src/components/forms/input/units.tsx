import { Field, Input } from 'ioiti-ui'

export default function InputUnits() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Website">
        <Input defaultValue="example.com" prefix="https://" />
      </Field>
      <Field label="Timeout" description="How long a request may take before it is given up">
        <Input inputMode="numeric" defaultValue="250" suffix="ms" />
      </Field>
      <Field label="Unit price">
        <Input inputMode="decimal" defaultValue="18.40" prefix="€" />
      </Field>
      <Field label="Parcel weight">
        <Input inputMode="decimal" defaultValue="2.5" suffix="kg" />
      </Field>
      <Field label="Discount">
        <Input inputMode="numeric" defaultValue="15" suffix="%" />
      </Field>
      <Field label="Shipping cost">
        <Input inputMode="decimal" defaultValue="6.90" prefix="€" suffix="per parcel" />
      </Field>
    </div>
  )
}
