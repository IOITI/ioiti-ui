import { BarChart, SegmentedControl, formatMoney } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

const MONTHS = [
  { label: 'May', shop: 420, phone: 180, partners: 90 },
  { label: 'Jun', shop: 460, phone: 160, partners: 120 },
  { label: 'Jul', shop: 380, phone: 140, partners: 150 },
  { label: 'Aug', shop: 300, phone: 120, partners: 110 },
  { label: 'Sep', shop: 510, phone: 200, partners: 170 },
  { label: 'Oct', shop: 560, phone: 210, partners: 190 },
]
const MARGIN = [
  { label: 'Mon', margin: 420 },
  { label: 'Tue', margin: -180 },
  { label: 'Wed', margin: 310 },
  { label: 'Thu', margin: -60 },
  { label: 'Fri', margin: 520 },
  { label: 'Sat', margin: 240 },
  { label: 'Sun', margin: -90 },
]

function Preview() {
  const [variant, setVariant] = useState<'grouped' | 'stacked'>('grouped')
  return (
    <div className="grid gap-8 p-5 md:grid-cols-2">
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
        />
      </div>
      <BarChart ariaLabel="Margin by day" tone="sign" height={260} data={MARGIN} series={[{ key: 'margin', label: 'Margin' }]} formatValue={(value) => formatMoney(value)} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
