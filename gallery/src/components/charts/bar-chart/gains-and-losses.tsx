import { BarChart, formatMoney } from 'ioiti-ui'

const MARGIN = [
  { label: 'Mon', margin: 420, orders: 38 },
  { label: 'Tue', margin: -180, orders: 12 },
  { label: 'Wed', margin: 310, orders: 29 },
  { label: 'Thu', margin: -60, orders: 17 },
  { label: 'Fri', margin: 520, orders: 44 },
  { label: 'Sat', margin: 240, orders: 26 },
  { label: 'Sun', margin: -90, orders: 9 },
]

const WEEKDAY: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
}

export default function BarChartGainsAndLosses() {
  return (
    <BarChart
      ariaLabel="Margin by day"
      tone="sign"
      height={220}
      data={MARGIN}
      series={[{ key: 'margin', label: 'Margin' }]}
      formatValue={(value) => formatMoney(value)}
      formatTitle={(datum) => WEEKDAY[datum.label]}
      details={(datum) => [{ label: 'Orders', value: String(datum.orders) }]}
    />
  )
}
