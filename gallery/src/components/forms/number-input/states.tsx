import { Field, NumberInput } from 'ioiti-ui'
import { useState } from 'react'

const IN_STOCK = 40

export default function NumberInputStates() {
  const [quantity, setQuantity] = useState<number | null>(48)
  const tooMany = quantity !== null && quantity > IN_STOCK
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Field label="Quantity" htmlFor="number-quantity" error={tooMany ? `Only ${IN_STOCK} in stock: order ${IN_STOCK} at most` : undefined}>
        <NumberInput id="number-quantity" value={quantity} onChange={setQuantity} min={1} max={500} integer error={tooMany} />
      </Field>
      <Field label="Free units" htmlFor="number-free" description="Set by the offer, not by hand">
        <NumberInput id="number-free" defaultValue={2} min={0} integer disabled />
      </Field>
    </div>
  )
}
