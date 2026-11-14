import { LineChart } from 'ioiti-ui'

import { DELAY_READINGS } from '../../../samples/charts'

const RESTART = Date.UTC(2026, 9, 27, 12, 30)

export default function LineChartLimitAndMoments() {
  return (
    <LineChart
      ariaLabel="Delay of the orders through the day"
      data={DELAY_READINGS}
      series={[{ key: 'delay', label: 'Delay' }]}
      area
      zero
      height={220}
      timeZone="Europe/Paris"
      references={[{ value: 250, label: 'Limit, 250 ms', tone: 'negative' }]}
      markers={[{ t: RESTART, label: 'Restart' }]}
      formatValue={(value) => `${Math.round(value)} ms`}
      details={(point) => [{ label: 'Orders', value: point.orders === null ? '—' : String(point.orders) }]}
    />
  )
}
