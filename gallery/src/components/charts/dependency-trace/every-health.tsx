import { DependencyTrace } from 'ioiti-ui'
import type { TraceNode } from 'ioiti-ui'
import { useState } from 'react'

const NODES: TraceNode[] = [
  { id: 'shop', label: 'Shop', type: 'client', x: 60, y: 140 },
  { id: 'orders', label: 'Orders', type: 'service', x: 190, y: 140, status: 'ok', statusLabel: 'Up' },
  { id: 'stock', label: 'Stock', type: 'service', x: 330, y: 50, status: 'warning', statusLabel: 'Slow', detail: 'answers in 2.4 s' },
  { id: 'payments', label: 'Payments', type: 'api', x: 330, y: 140, status: 'down', statusLabel: 'Down', detail: 'since 09:42' },
  { id: 'invoices', label: 'Invoices', type: 'service', x: 330, y: 230, status: 'unknown', statusLabel: 'Unknown', detail: 'no check for 10 min' },
  { id: 'archive', label: 'Archive', type: 'database', x: 460, y: 230, status: 'disabled', statusLabel: 'Switched off' },
]

export default function DependencyTraceEveryHealth() {
  const [traced, setTraced] = useState<string | null>(null)
  return (
    <div className="max-w-2xl space-y-3">
      <DependencyTrace
        label="Services of the shop"
        width={520}
        height={280}
        nodes={NODES}
        connections={[
          { from: 'shop', to: 'orders', label: 'HTTP' },
          { from: 'orders', to: 'stock', label: 'reserve' },
          { from: 'orders', to: 'payments', label: 'charge' },
          { from: 'orders', to: 'invoices', label: 'jobs' },
          { from: 'invoices', to: 'archive', label: 'store' },
        ]}
        onNodeSelect={(id) => setTraced((was) => (was === id ? null : id))}
      />
      <p className="text-xs text-muted-foreground">
        Traced: {NODES.find((node) => node.id === traced)?.label ?? 'none (click a node, or Tab to one and press Enter)'}
      </p>
    </div>
  )
}
