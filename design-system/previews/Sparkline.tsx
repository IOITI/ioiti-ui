import { KpiGrid, KpiTile, Sparkline, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="p-5">
    <KpiGrid>
      <KpiTile label="Orders this week" value="1,284" hint="+12% on last week">
        <Sparkline label="Orders per day" values={[160, 172, 168, 190, 184, 201, 209]} width={180} height={32} />
      </KpiTile>
      <KpiTile label="Median delivery" value="2.4 days" hint="−0.3 on last week">
        <Sparkline label="Median delivery, days" values={[2.9, 2.8, 2.7, 2.7, 2.5, 2.4, 2.4]} tone="positive" width={180} height={32} />
      </KpiTile>
      <KpiTile label="Margin by day" value={formatMoney(1840)} hint="5 days of 7 above zero">
        <Sparkline label="Margin by day" variant="bars" values={[420, 380, -120, 510, -60, 330, 380]} width={180} height={32} />
      </KpiTile>
      <KpiTile label="Returns" value="38" hint="Steady">
        <Sparkline label="Returns per day" values={[6, 5, 6, 5, 6, 5, 5]} tone="neutral" width={180} height={32} />
      </KpiTile>
    </KpiGrid>
  </div>,
)
