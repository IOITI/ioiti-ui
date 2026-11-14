import { RadioGroup, RadioGroupItem } from 'ioiti-ui'
import { useState } from 'react'

const SIZES = ['S', 'M', 'L', 'XL']
const OUT_OF_STOCK = ['XL']

export default function RadioGroupItems() {
  const [size, setSize] = useState('M')
  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-text-primary">Size</legend>
        {/* Its items as children: each says whether it is checked, and what a press does. */}
        <RadioGroup name="size" className="flex flex-wrap gap-4 space-y-0">
          {SIZES.map((each) => (
            <RadioGroupItem
              key={each}
              name="size"
              value={each}
              label={`Size ${each}`}
              checked={size === each}
              onChange={() => setSize(each)}
              disabled={OUT_OF_STOCK.includes(each)}
            />
          ))}
        </RadioGroup>
      </fieldset>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Size {size}; {OUT_OF_STOCK.join(', ')} out of stock.
      </p>
    </div>
  )
}
