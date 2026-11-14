import { Field, NumberInput } from 'ioiti-ui'

export default function NumberInputUnits() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Field label="Daily limit" htmlFor="number-daily-limit">
        <NumberInput id="number-daily-limit" defaultValue={500} min={0} max={5000} step={50} suffix="€" />
      </Field>
      <Field label="Copies" htmlFor="number-copies">
        <NumberInput id="number-copies" defaultValue={2} min={1} max={20} integer />
      </Field>
      <Field label="Delay before retrying" htmlFor="number-retry-delay">
        <NumberInput id="number-retry-delay" defaultValue={1.5} min={0} step={0.5} precision={1} suffix="s" />
      </Field>
    </div>
  )
}
