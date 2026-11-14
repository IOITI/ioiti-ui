import { BarChart, SegmentedControl } from 'ioiti-ui'
import { useState } from 'react'

const MONTHS = [
  { label: 'May', shop: 420, phone: 180, partners: 90 },
  { label: 'Jun', shop: 460, phone: 160, partners: 120 },
  { label: 'Jul', shop: 380, phone: 140, partners: 150 },
  { label: 'Aug', shop: 300, phone: 120, partners: 110 },
  { label: 'Sep', shop: 510, phone: 200, partners: 170 },
  { label: 'Oct', shop: 560, phone: 210, partners: 190 },
]

export default function BarChartGroupedOrStacked() {
  // Changing it moves the bars from one to the other.
  const [variant, setVariant] = useState<'grouped' | 'stacked'>('grouped')
  return (
    <div className="space-y-3">
      <SegmentedControl
        label="Bars"
        size="sm"
        value={variant}
        onChange={setVariant}
        options={[
          { value: 'grouped', label: 'Side by side' },
          { value: 'stacked', label: 'Stacked' },
        ]}
      />
      <BarChart
        ariaLabel="Orders by channel and month"
        variant={variant}
        data={MONTHS}
        series={[
          { key: 'shop', label: 'Shop' },
          { key: 'phone', label: 'Phone' },
          { key: 'partners', label: 'Partners' },
        ]}
        integer
      />
    </div>
  )
}
