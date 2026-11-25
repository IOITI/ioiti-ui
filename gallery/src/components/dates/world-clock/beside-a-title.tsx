import { Button, WorldClock } from 'ioiti-ui'

export default function WorldClockBesideATitle() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-lg font-semibold tracking-tight">Dispatch</p>
        <p className="text-sm text-muted-foreground">Parcels leaving today, from both warehouses.</p>
      </div>
      <div className="flex items-center gap-3">
        <WorldClock
          size="sm"
          title={null}
          footer="Both warehouses"
          cities={[
            { id: 'lyon', name: 'Lyon', timeZone: 'Europe/Paris' },
            { id: 'montreal', name: 'Montreal', timeZone: 'America/Toronto' },
          ]}
        />
        <Button size="sm" variant="outline">
          Pause the dispatch
        </Button>
      </div>
    </div>
  )
}
