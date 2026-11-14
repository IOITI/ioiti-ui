import { formatMoney, StatCard, StatGrid } from 'ioiti-ui'

export default function StatCardTone() {
  return (
    <StatGrid>
      <StatCard
        label="Result today"
        value={340}
        trend={[-120, -40, 80, 210, 160, 340]}
        trendLabels={['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']}
        period="since 09:00"
        format={(value) => formatMoney(value, 'EUR', true)}
        // The headline in the tone of its value, as each point scrubbed.
        toneOf={(value) => (value > 0 ? 'text-positive' : value < 0 ? 'text-negative' : undefined)}
      />
      <StatCard
        label="Result this week"
        value={-860}
        trend={[420, 610, 150, -320, -860]}
        trendLabels={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}
        period="since Monday"
        format={(value) => formatMoney(value, 'EUR', true)}
        toneOf={(value) => (value > 0 ? 'text-positive' : value < 0 ? 'text-negative' : undefined)}
      />
    </StatGrid>
  )
}
