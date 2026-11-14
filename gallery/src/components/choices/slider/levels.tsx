import { Slider } from 'ioiti-ui'

export default function SliderLevels() {
  return (
    <div className="w-full max-w-md">
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
    </div>
  )
}
