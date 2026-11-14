import { KpiGrid, KpiTile, Meter } from 'ioiti-ui'

export default function KpiTileAttention() {
  return (
    <KpiGrid columns={3}>
      <KpiTile label="Storage" value="91%" hint="of 50 GB" tone="warning" toneLabel="Near the limit">
        <Meter ratio={0.91} tone="warning" label="Storage used" scale={['0', '50 GB']} />
      </KpiTile>
      <KpiTile label="Failed payments" value="12" hint="In the last hour" tone="negative" toneLabel="Failing" />
      <KpiTile label="Orders waiting" value="3" hint="Oldest: 20 min" />
    </KpiGrid>
  )
}
