import { Badge } from 'ioiti-ui'

export default function BadgeDot() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge tone="success" dot>
        Paid
      </Badge>
      <Badge tone="danger" dot>
        Refused
      </Badge>
      <Badge dot>Archived</Badge>
      {/* A pulse for what is live, and only that. */}
      <Badge tone="warning" dot pulse>
        Syncing
      </Badge>
      <Badge tone="success" variant="outline" dot pulse>
        Live
      </Badge>
    </div>
  )
}
