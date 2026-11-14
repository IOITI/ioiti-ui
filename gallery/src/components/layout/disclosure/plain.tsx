import { Disclosure, Field, NumberInput } from 'ioiti-ui'

export default function DisclosurePlain() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <Field label="Daily limit" htmlFor="disclosure-limit">
        <NumberInput id="disclosure-limit" defaultValue={500} min={0} step={50} suffix="€" />
      </Field>
      <Disclosure summary="What the daily limit does">
        <p className="text-sm text-muted-foreground">
          No order is accepted once the day’s orders reach it: the next ones wait for the morning, and the customer is told when theirs will leave.
        </p>
      </Disclosure>
    </div>
  )
}
