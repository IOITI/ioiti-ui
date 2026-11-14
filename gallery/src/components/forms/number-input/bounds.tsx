import { Field, NumberInput } from 'ioiti-ui'
import { useState } from 'react'

export default function NumberInputBounds() {
  const [months, setMonths] = useState<number | null>(12)
  const [rate, setRate] = useState<number | null>(4.25)
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Field label="Length of the contract" htmlFor="number-months" description="From 1 to 36 months">
          <NumberInput id="number-months" value={months} onChange={setMonths} min={1} max={36} integer suffix="months" />
        </Field>
        <Field label="Interest rate" htmlFor="number-rate" description="Typed, to two decimals: no buttons">
          <NumberInput id="number-rate" value={rate} onChange={setRate} min={0} max={20} step={0.01} precision={2} suffix="%" steppers={false} />
        </Field>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Months: {months ?? 'none'} · Rate: {rate ?? 'none'}
      </p>
    </div>
  )
}
