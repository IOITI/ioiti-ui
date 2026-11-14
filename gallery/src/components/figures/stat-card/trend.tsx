import { formatMoney, StatCard, StatGrid } from 'ioiti-ui'

export default function StatCardTrend() {
  return (
    <StatGrid>
      <StatCard
        label="Revenue"
        value={23950}
        trend={[18200, 19400, 21480, 20100, 23950]}
        trendLabels={['Week 39', 'Week 40', 'Week 41', 'Week 42', 'Week 43']}
        previous={20100}
        period="vs last week"
        format={(value) => formatMoney(value, 'EUR')}
      />
      <StatCard
        label="Average delivery"
        value={3.1}
        trend={[3.8, 3.6, 3.4, 3.3, 3.1]}
        trendLabels={['June', 'July', 'August', 'September', 'October']}
        delta={-6}
        goodWhen="down"
        period="days, vs last month"
        format={(value) => `${value.toFixed(1)} d`}
      />
      <StatCard
        label="New customers"
        value={96}
        trend={[71, 84, 80, 102, 96]}
        trendLabels={['Week 39', 'Week 40', 'Week 41', 'Week 42', 'Week 43']}
        previous={102}
        period="vs last week"
        format={(value) => String(value)}
      />
    </StatGrid>
  )
}
