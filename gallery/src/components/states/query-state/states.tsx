import { KpiGrid, KpiTile, QueryState, SegmentedControl, Skeleton } from 'ioiti-ui'
import { useState } from 'react'

type Phase = 'loading' | 'failed' | 'stale' | 'loaded'

export default function QueryStateStates() {
  const [phase, setPhase] = useState<Phase>('loading')
  // As a query gives them: pending until the first answer, an error, the data of the last answer.
  const error = phase === 'failed' || phase === 'stale' ? new Error('The server answered 503 Service Unavailable.') : null
  return (
    <div className="space-y-4">
      <SegmentedControl
        label="State of the data"
        size="sm"
        value={phase}
        onChange={setPhase}
        options={(['loading', 'failed', 'stale', 'loaded'] as const).map((each) => ({ value: each, label: each }))}
      />
      <QueryState
        isPending={phase === 'loading' || phase === 'failed'}
        error={error}
        hasData={phase === 'stale' || phase === 'loaded'}
        skeleton={
          <KpiGrid>
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-[7.5rem] rounded-2xl" />
            ))}
          </KpiGrid>
        }
      >
        <KpiGrid>
          <KpiTile label="Orders" value="42" />
          <KpiTile label="Amount" value="18,420 €" />
          <KpiTile label="Returns" value="3" />
          <KpiTile label="Late deliveries" value="1" />
        </KpiGrid>
      </QueryState>
    </div>
  )
}
