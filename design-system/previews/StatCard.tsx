import { StatCard, StatGrid, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="p-5">
    <StatGrid>
      <StatCard
        label="Revenue"
        value={23950}
        trend={[18200, 19400, 21480, 20100, 23950]}
        trendLabels={['Week 39', 'Week 40', 'Week 41', 'Week 42', 'Week 43']}
        previous={21480}
        period="vs last week"
        format={(value) => formatMoney(value, 'EUR')}
      />
      <StatCard
        label="Average delivery"
        value={3.1}
        trend={[3.8, 3.6, 3.4, 3.3, 3.1]}
        delta={-6}
        goodWhen="down"
        period="days, vs last month"
        format={(value) => `${value.toFixed(1)} d`}
      />
    </StatGrid>
  </div>,
)
