import { RangeSlider, Slider } from 'ioiti-ui'

export default function SliderDisabled() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Slider label="Discount" defaultValue={10} min={0} max={30} format={(value) => `${value}%`} disabled />
        <p className="text-xs text-muted-foreground">Set by the contract until 31 Dec 2026.</p>
      </div>
      <div className="flex flex-col gap-2">
        <RangeSlider label="Delivery hours" defaultValue={[8, 12]} min={6} max={20} format={(value) => `${value}:00`} disabled />
        <p className="text-xs text-muted-foreground">The carrier's, for this address.</p>
      </div>
    </div>
  )
}
