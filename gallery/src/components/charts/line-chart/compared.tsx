import { formatMoney, LineChart } from 'ioiti-ui'

import { REVENUE_BY_SHOP } from '../../../samples/charts'

export default function LineChartCompared() {
  return (
    <LineChart
      ariaLabel="Revenue of three shops each week since May, and last year's"
      data={REVENUE_BY_SHOP}
      series={[
        { key: 'north', label: 'North street' },
        { key: 'harbour', label: 'Harbour' },
        { key: 'station', label: 'Station' },
        { key: 'lastYear', label: 'Last year', dashed: true },
      ]}
      zero
      timeZone="Europe/Paris"
      formatValue={(value) => formatMoney(value)}
    />
  )
}
