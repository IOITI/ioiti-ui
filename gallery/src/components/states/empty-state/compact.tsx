import { Button, EmptyState, Panel } from 'ioiti-ui'
import { SearchX } from 'lucide-react'
import { useState } from 'react'

export default function EmptyStateCompact() {
  const [cleared, setCleared] = useState(false)
  return (
    <div className="max-w-lg">
      <Panel title="Alerts of the day" description={cleared ? 'Every severity, the last 24 hours.' : 'High severity, the last 24 hours.'}>
        {cleared ? (
          <p className="text-sm text-muted-foreground">12 alerts, the newest at 14:02.</p>
        ) : (
          <EmptyState
            compact
            icon={<SearchX />}
            title="No alert matches these filters"
            description="Nothing of high severity came in during the last 24 hours."
            actions={
              <Button size="sm" variant="outline" onClick={() => setCleared(true)}>
                Clear the filters
              </Button>
            }
          />
        )}
      </Panel>
    </div>
  )
}
