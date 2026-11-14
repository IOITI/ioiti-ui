import { StatusBadge } from 'ioiti-ui'

export default function StatusBadgeStatuses() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status="ok" />
      <StatusBadge status="warning" />
      <StatusBadge status="down" />
      <StatusBadge status="unknown" />
      <StatusBadge status="disabled" />
    </div>
  )
}
