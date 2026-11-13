import { KpiGrid, KpiTile, Meter, Sparkline, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="p-5">
    <KpiGrid period="Compared with yesterday">
      <KpiTile lead label="Revenue today" value={formatMoney(12400, 'EUR')} change={8.4} hint="Since midnight">
        <Sparkline values={[3.1, 4.2, 3.8, 5.6, 6.1, 7.4, 8.9, 10.2, 12.4]} width={240} height={48} label="Revenue through the day" className="w-full" />
      </KpiTile>
      <KpiTile label="Orders" value="38" change={4.2} />
      <KpiTile label="Median delivery" value="2.4 days" change={-6.1} goodWhen="down" />
      <KpiTile label="Refunds" value="7" change={40} goodWhen="down" tone="negative" toneLabel="Above usual" />
      <KpiTile label="Storage" value="91%" hint="of 50 GB" tone="warning" toneLabel="Near the limit">
        <Meter ratio={0.91} tone="warning" label="Storage used" scale={['0', '50 GB']} />
      </KpiTile>
    </KpiGrid>
  </div>,
)
