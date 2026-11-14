import { BarChart } from 'ioiti-ui'

/** 100 shops counted by how their sales changed on last month, by step of one percent: this shop's step is marked. */
const SHOPS_BY_CHANGE = [1, 2, 4, 7, 11, 15, 17, 14, 11, 8, 5, 3, 1, 1].map((count, index) => ({
  label: `${index - 6 > 0 ? '+' : ''}${index - 6}%`,
  count,
}))

export default function BarChartOneSetApart() {
  return (
    <BarChart
      ariaLabel="Shops by change in sales on last month, this shop marked"
      height={200}
      data={SHOPS_BY_CHANGE}
      series={[{ key: 'count', label: 'Shops' }]}
      integer
      marked={{ index: 11, label: 'This shop' }}
      tickAt={(_, index) => index % 2 === 0}
      showLegend={false}
    />
  )
}
