import { Alert, AlertDescription, AlertTitle, Button, EmptyText, ErrorText, KpiGrid, PageHeader, Panel, QueryState, Skeleton } from 'ioiti-ui'
import { useState } from 'react'

import { Demo } from '../parts'

type Phase = 'loading' | 'failed' | 'stale' | 'loaded'

function Loaded() {
  return (
    <KpiGrid>
      {['Orders', 'Amount', 'Returns', 'Errors'].map((label) => (
        <div key={label} className="flex min-h-[7.5rem] flex-col rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-5 dark:bg-surface/25">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">42</p>
        </div>
      ))}
    </KpiGrid>
  )
}

function Query() {
  const [phase, setPhase] = useState<Phase>('loading')
  const error = phase === 'failed' || phase === 'stale' ? new Error('The server answered 503 Service Unavailable.') : null
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="State of the data">
        {(['loading', 'failed', 'stale', 'loaded'] as const).map((each) => (
          <Button key={each} size="sm" variant={phase === each ? 'primary' : 'outline'} aria-pressed={phase === each} onClick={() => setPhase(each)}>
            {each}
          </Button>
        ))}
      </div>
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
        <Loaded />
      </QueryState>
    </div>
  )
}

export function States() {
  return (
    <>
      <PageHeader title="Empty, loading, failed" description="Every page has these states: the design says them the same way everywhere." />

      <Demo
        id="query"
        title="QueryState"
        description="Loading shows the shape of what comes, as high as it will be. A failure says what went wrong; a failed refresh keeps what is on screen and says so above it."
        names={['QueryState']}
      >
        <Query />
      </Demo>

      <Demo id="empty" title="EmptyText" description="What a list says when it has nothing: one quiet line, which says what would be there." names={['EmptyText']} className="block w-full">
        <EmptyText>No order yet today: they appear here as they are placed.</EmptyText>
      </Demo>

      <Demo
        id="error"
        title="ErrorText"
        description="What went wrong with an action, under its button: read out at once, in the negative colour."
        names={['ErrorText']}
        className="flex flex-col items-start gap-2"
      >
        <Button size="sm">Send the invoice</Button>
        <ErrorText>Could not send the invoice: the mail server does not answer.</ErrorText>
      </Demo>

      <Panel title="A feature switched off" description="Said where it would be, with what switches it on.">
        <Alert tone="warning">
          <AlertTitle>Exports are switched off</AlertTitle>
          <AlertDescription>An administrator switches them on in the settings.</AlertDescription>
        </Alert>
      </Panel>
    </>
  )
}
