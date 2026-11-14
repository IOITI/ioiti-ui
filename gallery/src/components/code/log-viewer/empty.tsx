import { Button, LogViewer } from 'ioiti-ui'
import { useState } from 'react'

export default function LogViewerEmpty() {
  const [lines, setLines] = useState<string[]>([])
  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <Button
          size="sm"
          variant="outline"
          disabled={lines.length > 0}
          onClick={() => setLines(['INFO  Job queued: backup of the database', 'INFO  Waiting for a worker …'])}
        >
          Queue the job
        </Button>
      </div>
      <LogViewer label="Nightly backup" lines={lines} height={160} emptyText="The job has not started: its output shows here as it runs." />
    </div>
  )
}
