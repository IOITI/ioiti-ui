import { KpiGrid, KpiTile, Meter } from 'ioiti-ui'

export default function MeterInATile() {
  return (
    <KpiGrid columns={3}>
      <KpiTile label="Disk" value="91%" hint="of 50 GB" tone="warning" toneLabel="Near the limit">
        <Meter ratio={0.91} tone="warning" label="Disk used" scale={['0', '50 GB']} />
      </KpiTile>
      <KpiTile
        label="Orders today"
        value={
          <>
            3 <span className="text-base font-normal text-muted-foreground">of 10</span>
          </>
        }
        hint="The day’s limit"
      >
        <Meter ratio={0.3} label="Orders of the day’s limit" scale={['0', '10']} />
      </KpiTile>
      <KpiTile label="Returns" value="2.1%" hint="Under 5 %">
        <Meter ratio={0.42} tone="positive" label="Returns against their limit" scale={['0', '5 %']} />
      </KpiTile>
    </KpiGrid>
  )
}
