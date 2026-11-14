import {
  Badge,
  EmptyState,
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
import { Truck } from 'lucide-react'
import { useState } from 'react'

type Phase = 'loading' | 'failed' | 'empty' | 'loaded'

const DELIVERIES = [
  { id: 'DL-310', to: 'Lyon', state: 'On its way' },
  { id: 'DL-309', to: 'Nantes', state: 'Delivered' },
  { id: 'DL-308', to: 'Lille', state: 'Delivered' },
]

export default function QueryStateEmpty() {
  const [phase, setPhase] = useState<Phase>('loaded')
  const rows = phase === 'loaded' ? DELIVERIES : []
  return (
    <div className="space-y-4">
      <SegmentedControl
        label="State of the data"
        size="sm"
        value={phase}
        onChange={setPhase}
        options={(['loading', 'failed', 'empty', 'loaded'] as const).map((each) => ({ value: each, label: each }))}
      />
      <Panel title="Deliveries" description="The last three days." dense>
        <QueryState
          isPending={phase === 'loading'}
          error={phase === 'failed' ? new Error('The carrier’s service did not answer.') : null}
          hasData={phase === 'empty' || phase === 'loaded'}
          skeleton={
            <div className="space-y-2 p-3">
              {DELIVERIES.map((delivery) => (
                <Skeleton key={delivery.id} className="h-8 w-full" />
              ))}
            </div>
          }
        >
          {/* Loaded with nothing in it: the page says so, QueryState does not. */}
          {rows.length === 0 ? (
            <EmptyState compact icon={<Truck />} title="No delivery in the last three days" description="Deliveries appear here as soon as they leave the warehouse." />
          ) : (
            <Table aria-label="Deliveries">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Delivery</TableHeaderCell>
                  <TableHeaderCell>To</TableHeaderCell>
                  <TableHeaderCell>State</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono text-xs">{delivery.id}</TableCell>
                    <TableCell>{delivery.to}</TableCell>
                    <TableCell>
                      <Badge tone={delivery.state === 'Delivered' ? 'success' : 'neutral'}>{delivery.state}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </QueryState>
      </Panel>
    </div>
  )
}
