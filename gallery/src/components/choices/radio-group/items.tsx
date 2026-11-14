import { RadioGroup, RadioGroupItem } from 'ioiti-ui'
import { useState } from 'react'

const SIZES = ['S', 'M', 'L', 'XL']
const OUT_OF_STOCK = ['XL']

export default function RadioGroupItems() {
  const [size, setSize] = useState('M')
  return (
    <div className="flex flex-col gap-4">
      {/* Its items as children: each says whether it is checked, and what a press does. Named where no heading is. */}
      <RadioGroup name="size" aria-label="Size" className="flex flex-wrap gap-4 space-y-0">
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
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Size {size}; {OUT_OF_STOCK.join(', ')} out of stock.
      </p>
    </div>
  )
}
