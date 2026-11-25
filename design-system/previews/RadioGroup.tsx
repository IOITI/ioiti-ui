import { RadioGroup } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const DELIVERIES = [
  { value: 'standard', label: 'Standard', description: 'Three to five days, free from 50 €' },
  { value: 'express', label: 'Express', description: 'Tomorrow, before noon' },
  { value: 'pickup', label: 'Pick-up point', description: 'Two days, at a shop near you' },
  { value: 'same-day', label: 'Same day', description: 'Within the city only: not for this address', disabled: true },
]

function Preview() {
  const [delivery, setDelivery] = useState('standard')
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-2">
        {/* The question its choices answer names the group. */}
        <h3 id="delivery-question" className="text-xs font-semibold text-text-primary">
          Delivery
        </h3>
        <RadioGroup name="delivery" aria-labelledby="delivery-question" value={delivery} onChange={setDelivery} options={DELIVERIES} />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Chosen: {DELIVERIES.find((option) => option.value === delivery)?.label}.
      </p>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
