import { Field, Hint, Input } from 'ioiti-ui'

export default function HintText() {
  return (
    <div className="flex max-w-sm flex-col gap-5">
      {/* Plain words take no focus: wrap makes them a stop of the keyboard. */}
      <p className="text-sm">
        Delivered in{' '}
        <Hint content="Working days, from the day the order leaves the warehouse" wrap>
          <span className="underline decoration-dotted underline-offset-4">2 to 3 days</span>
        </Hint>
        .
      </p>
      {/* A full-width field keeps its width. */}
      <Field label="Amount">
        <Hint content="In euros, cents after a point" className="flex w-full">
          <Input defaultValue="120.00" />
        </Hint>
      </Field>
    </div>
  )
}
