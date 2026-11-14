import { StatusBadge } from 'ioiti-ui'
import type { HealthStatus } from 'ioiti-ui'

const SERVICES: { name: string; detail: string; status: HealthStatus; label?: string }[] = [
  { name: 'Orders API', detail: 'Answers in 120 ms', status: 'ok' },
  { name: 'Payments', detail: 'Answers in 2.4 s since 14:02', status: 'warning', label: 'Slow' },
  { name: 'Mail', detail: 'No answer since 13:47', status: 'down' },
  { name: 'Warehouse feed', detail: 'Not reached yet today', status: 'unknown' },
  { name: 'Legacy exports', detail: 'Switched off on 1 October', status: 'disabled', label: 'Retired' },
]

export default function StatusBadgeServices() {
  return (
    <ul className="max-w-md divide-y divide-border rounded-xl border border-border" aria-label="Services">
      {SERVICES.map((service) => (
        <li key={service.name} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{service.name}</p>
            <p className="truncate text-xs text-muted-foreground">{service.detail}</p>
          </div>
          <StatusBadge status={service.status} label={service.label} />
        </li>
      ))}
    </ul>
  )
}
