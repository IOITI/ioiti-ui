import { RangeSlider, Slider } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="grid w-full gap-8 p-5 sm:grid-cols-2">
    <Slider
      label="Risk per order"
      defaultValue={1.5}
      min={0}
      max={5}
      step={0.5}
      format={(value) => `${value.toFixed(1)}%`}
      ticks={[
        { value: 0, label: '0%' },
        { value: 2.5, label: '2.5%' },
        { value: 5, label: '5%' },
      ]}
      levels={[
        { from: 0, to: 2, tone: 'positive' },
        { from: 2, to: 3.5, tone: 'warning' },
        { from: 3.5, to: 5, tone: 'negative' },
      ]}
    />
    <Slider label="Delay before retrying" defaultValue={30} min={0} max={120} step={5} format={(value) => `${value} s`} showInput />
    <RangeSlider
      label="Price"
      defaultValue={[20, 80]}
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
    <RangeSlider label="Opening hours" defaultValue={[9, 18]} min={0} max={24} format={(value) => `${String(value).padStart(2, '0')}:00`} ticks />
  </div>,
)
