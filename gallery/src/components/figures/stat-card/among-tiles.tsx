import { formatMoney, KpiGrid, KpiTile, Meter, StatCard } from 'ioiti-ui'

export default function StatCardAmongTiles() {
  return (
    <KpiGrid period="Compared with last Monday">
      <StatCard
        label="Today"
        value={4210}
        trend={[0, 640, 1380, 2150, 2900, 3580, 4210]}
        trendLabels={['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']}
        previous={3890}
        period="vs last Monday"
        format={(value) => formatMoney(value, 'EUR')}
      />
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
      <KpiTile label="Returns" value="2.1%" change={-0.4} goodWhen="down" hint="Under 5 %">
        <Meter ratio={0.42} tone="positive" label="Returns against their limit" scale={['0', '5 %']} />
      </KpiTile>
      <KpiTile label="Next price update" value="12:00" hint="In 2 h 48" />
    </KpiGrid>
  )
}
