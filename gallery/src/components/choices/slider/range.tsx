import { RangeSlider } from 'ioiti-ui'
import { useState } from 'react'

const hour = (value: number) => `${String(value).padStart(2, '0')}:00`

export default function SliderRange() {
  const [price, setPrice] = useState<[number, number]>([20, 80])
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <RangeSlider
          label="Price"
          value={price}
          onChange={setPrice}
          min={0}
          max={150}
          step={5}
          format={(value) => `${value} €`}
          ticks={[
            { value: 0, label: '0 €' },
            { value: 75, label: '75 €' },
            { value: 150, label: '150 €' },
          ]}
        />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Items from {price[0]} € to {price[1]} €.
        </p>
      </div>
      <RangeSlider label="Opening hours" defaultValue={[9, 18]} min={0} max={24} format={hour} ticks />
    </div>
  )
}
