import { KpiGrid, KpiTile, Meter, formatMoney } from 'ioiti-ui'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <div className="p-5">
    <KpiGrid>
      <KpiTile label="Orders today" value="12" hint="8 yesterday" />
      <KpiTile label="Amount" value={formatMoney(4210, 'EUR')} hint="Since midnight" />
      <KpiTile label="Storage" value="62%" hint="of 50 GB">
        <Meter ratio={0.62} tone="warning" label="Storage used" scale={['0', '50 GB']} />
      </KpiTile>
      <KpiTile label="Errors" value="0" hint="In the last hour">
        <Meter ratio={0.05} tone="positive" label="Error budget used" />
      </KpiTile>
    </KpiGrid>
  </div>,
)
