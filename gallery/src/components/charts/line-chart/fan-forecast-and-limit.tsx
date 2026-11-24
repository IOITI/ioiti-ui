import { FanChart } from 'ioiti-ui'

// A warehouse's stock forecast for the next twelve months: the median and where four forecasts in five fall.
const FORECAST = Array.from({ length: 12 }, (_, index) => {
  const month = index + 1
  const median = 820 - month * 38 + (month > 6 ? (month - 6) * 55 : 0)
  const spread = 30 + month * 22
  return { x: month, low: median - spread, median, high: median + spread }
})

export default function FanChartForecastAndLimit() {
  return (
    <FanChart
      aria-label="Stock forecast for the next twelve months"
      data={FORECAST}
      bands={[{ lower: 'low', upper: 'high', label: '4 forecasts in 5' }]}
      lines={[{ key: 'median', label: 'Median forecast', dashed: true }]}
      references={[{ value: 400, label: 'Reorder below 400', tone: 'danger' }]}
      markers={[{ x: 6, label: 'New supplier' }]}
      zero
      height={220}
      xLabel="Months from now"
      formatX={(month) => `Month ${month}`}
      formatXTick={(month) => String(month)}
      formatValue={(units) => `${Math.round(units)} units`}
    />
  )
}
