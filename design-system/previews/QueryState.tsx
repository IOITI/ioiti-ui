import { KpiGrid, KpiTile, QueryState, SegmentedControl, Skeleton } from 'ioiti-ui'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

type Phase = 'loading' | 'failed' | 'stale' | 'loaded'

function Preview() {
  const [phase, setPhase] = useState<Phase>('stale')
  const error = phase === 'failed' || phase === 'stale' ? new Error('The server answered 503 Service Unavailable.') : null
  return (
    <div className="w-full space-y-4 p-5">
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
            {[0, 1, 2, 3].map((index) => <Skeleton key={index} className="h-[7.5rem] rounded-2xl" />)}
          </KpiGrid>
        }
      >
        <KpiGrid>
          <KpiTile label="Orders today" value="12" hint="8 yesterday" />
          <KpiTile label="Amount" value="4,210.00 €" hint="Since midnight" />
          <KpiTile label="Returns" value="3" hint="This week" />
          <KpiTile label="Errors" value="0" hint="In the last hour" />
        </KpiGrid>
      </QueryState>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Preview />)
