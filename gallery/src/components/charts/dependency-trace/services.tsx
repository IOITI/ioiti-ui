import { DependencyTrace } from 'ioiti-ui'

export default function DependencyTraceServices() {
  return (
    <DependencyTrace
      className="max-w-2xl"
      label="Services"
      width={520}
      height={260}
      nodes={[
        // No status: an outside service, which reports no health.
        { id: 'web', label: 'Website', type: 'client', x: 70, y: 130 },
        { id: 'api', label: 'API', type: 'service', x: 210, y: 130, status: 'ok', statusLabel: 'Up' },
        { id: 'db', label: 'Database', type: 'database', x: 360, y: 60, status: 'ok', statusLabel: 'Up' },
        { id: 'queue', label: 'Queue', type: 'service', x: 360, y: 200, status: 'warning', statusLabel: 'Degraded', detail: '1,204 waiting' },
        { id: 'mail', label: 'Mail', type: 'api', x: 470, y: 200 },
      ]}
      connections={[
        { from: 'web', to: 'api', label: 'HTTP' },
        { from: 'api', to: 'db', label: 'SQL' },
        { from: 'api', to: 'queue', label: 'jobs' },
        { from: 'queue', to: 'mail', label: 'SMTP' },
      ]}
    />
  )
}
