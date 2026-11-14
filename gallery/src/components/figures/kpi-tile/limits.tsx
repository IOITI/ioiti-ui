import { formatMoney, KpiGrid, KpiTile, Meter } from 'ioiti-ui'

export default function KpiTileLimits() {
  return (
    <KpiGrid>
      <KpiTile label="Orders today" value="12" hint="8 yesterday" />
      <KpiTile label="Amount" value={formatMoney(4210, 'EUR')} hint="Since midnight" />
      <KpiTile label="Storage" value="62%" hint="of 50 GB">
        <Meter ratio={0.62} label="Storage used" scale={['0', '50 GB']} />
      </KpiTile>
      <KpiTile label="Errors" value="0" hint="In the last hour">
        <Meter ratio={0.05} tone="positive" label="Error budget used" />
      </KpiTile>
    </KpiGrid>
  )
}
