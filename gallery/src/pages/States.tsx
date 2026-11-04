import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ButtonLink,
  EmptyState,
  EmptyText,
  ErrorText,
  KpiGrid,
  PageHeader,
  Panel,
  QueryState,
  SegmentedControl,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'ioiti-ui'
import { FileCode, Plus, SearchX } from 'lucide-react'
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
        id="empty-state"
        title="EmptyState"
        description="What a page, a panel or a table says when it has nothing to show, and the way to something: what there is not under a heading, why, and what to do about it. Compact inside a panel or across a table's columns (below), its heading one level under what holds it. For one quiet line, EmptyText."
        names={['EmptyState']}
        className="block w-full"
      >
        <EmptyState
          headingLevel={3}
          icon={<FileCode />}
          title="No detection rule yet"
          description="Rules pushed to the repository appear here, with what they detect and where they run."
          actions={
            <>
              <ButtonLink to="/components/forms" leftIcon={<Plus className="size-4" />}>
                Write a rule
              </ButtonLink>
              <Button variant="outline">Import from Sigma</Button>
            </>
          }
        />
      </Demo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Alerts of the day" description="High severity, the last 24 hours.">
          <EmptyState
            compact
            icon={<SearchX />}
            title="No alert matches these filters"
            description="Nothing of high severity came in during the last 24 hours."
            actions={
              <Button size="sm" variant="outline">
                Clear the filters
              </Button>
            }
          />
        </Panel>
        <Panel title="Runs" description="The last runs of the rule." dense>
          <Table aria-label="Runs">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Started</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell numeric>Hits</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyState compact title="No run yet" description="A rule runs once it is deployed." />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Panel>
      </div>

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
