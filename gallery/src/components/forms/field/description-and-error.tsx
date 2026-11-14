import { Field, Input } from 'ioiti-ui'
import { useState } from 'react'

/** What is wrong with a quantity, in words that say how to put it right. */
function quantityError(text: string): string | undefined {
  const quantity = Number(text)
  return /^\d+$/.test(text) && quantity >= 1 && quantity <= 99 ? undefined : 'A whole number, from 1 to 99'
}

export default function FieldDescriptionAndError() {
  const [quantity, setQuantity] = useState('0')
  const error = quantityError(quantity)
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Field label="Timeout" description="How long a request may take before it is given up">
        <Input inputMode="numeric" defaultValue="250" suffix="ms" />
      </Field>
      <Field label="Quantity" error={error}>
        <Input inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </Field>
      <Field label="Reference" description="As printed on the delivery note" error="Two letters, then six digits: AB123456">
        <Input defaultValue="AB12-34" error />
      </Field>
    </div>
  )
}
