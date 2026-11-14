import { Field, Textarea } from 'ioiti-ui'

export default function TextareaStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Customer's note" description="Written by the customer when ordering">
        <Textarea rows={3} defaultValue="Please ring twice: the bell is weak." disabled />
      </Field>
      <Field label="Why is the order cancelled?" error="Say why, for the customer and for the warehouse">
        <Textarea rows={3} placeholder="Out of stock, asked by the customer…" error />
      </Field>
    </div>
  )
}
