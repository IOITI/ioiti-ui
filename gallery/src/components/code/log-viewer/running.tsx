import { Button, LogViewer } from 'ioiti-ui'
import { useEffect, useState } from 'react'

import { DEPLOY_OUTPUT } from '../../../samples/code'

export default function LogViewerRunning() {
  const [lines, setLines] = useState<string[]>(DEPLOY_OUTPUT.slice(0, 3))
  const [running, setRunning] = useState(false)
  // The job's output, a line every 120 ms: in an application, a stream's messages.
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setLines((was) => {
        const next = [...was, DEPLOY_OUTPUT[was.length % DEPLOY_OUTPUT.length]]
        if (next.length >= 400) setRunning(false)
        return next
      })
    }, 120)
    return () => clearInterval(timer)
  }, [running])
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setRunning((was) => !was)}>
          {running ? 'Pause the job' : 'Run the job'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setLines([])}>
          Clear
        </Button>
      </div>
      <LogViewer label="Deploy to sandbox" lines={lines} height={280} downloadName="deploy-1024-sandbox.log" />
    </div>
  )
}
