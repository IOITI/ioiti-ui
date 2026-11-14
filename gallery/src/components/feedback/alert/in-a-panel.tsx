import { Alert, AlertDescription, AlertTitle, Button, Panel } from 'ioiti-ui'
import { CalendarClock } from 'lucide-react'

export default function AlertInAPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Exports" description="Every order of the month, as a file.">
        <Alert tone="warning">
          <AlertTitle>Exports are switched off</AlertTitle>
          <AlertDescription>An administrator switches them on in the settings.</AlertDescription>
        </Alert>
      </Panel>
      <Panel title="Deliveries" description="This week’s rounds.">
        <div className="max-w-xs space-y-3">
          <Alert tone="neutral" icon={<CalendarClock />}>
            <AlertTitle>Next round on Monday</AlertTitle>
            <AlertDescription>Orders placed before Friday at noon leave with it.</AlertDescription>
          </Alert>
          <Alert tone="danger" icon={false}>
            <AlertTitle>Two addresses are incomplete</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Their parcels wait at the depot.</p>
              <Button size="xs" variant="outline">
                Complete them
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </Panel>
    </div>
  )
}
