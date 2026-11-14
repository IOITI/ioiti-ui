import { Button, RequestStatus } from 'ioiti-ui'
import { useState } from 'react'

export default function RequestStatusDismissible() {
  const [shown, setShown] = useState(true)
  if (!shown)
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Put away: the export goes on, the card only watched it.</span>
        <Button size="sm" variant="outline" onClick={() => setShown(true)}>
          Show it again
        </Button>
      </div>
    )
  return (
    <div className="max-w-md">
      <RequestStatus
        status="success"
        title="Export ready"
        description="12,480 orders, one row each. The file is kept for 7 days."
        subject="Orders of October"
        figures={[
          { label: 'Rows', value: '12,480' },
          { label: 'Size', value: '2.1 MB' },
        ]}
        reference={{ label: 'Export', value: 'EX-20261031-7' }}
        onDismiss={() => setShown(false)}
      />
    </div>
  )
}
