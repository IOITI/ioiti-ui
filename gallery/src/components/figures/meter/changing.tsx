import { Button, Meter } from 'ioiti-ui'
import type { MeterTone } from 'ioiti-ui'
import { useState } from 'react'

const LIMIT = 50

// The page knows its thresholds: near the limit from 80 %, past it at 100 %.
function toneOf(ratio: number): MeterTone {
  if (ratio >= 1) return 'negative'
  if (ratio >= 0.8) return 'warning'
  return 'neutral'
}

export default function MeterChanging() {
  const [used, setUsed] = useState(31)
  const ratio = used / LIMIT
  return (
    <div className="max-w-md space-y-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Storage used</span>
        <span className="tabular-nums">
          {used} of {LIMIT} GB
        </span>
      </div>
      <Meter ratio={ratio} tone={toneOf(ratio)} label="Storage used" scale={['0', `${LIMIT} GB`]} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={used >= LIMIT} onClick={() => setUsed(Math.min(LIMIT, used + 7))}>
          Upload 7 GB
        </Button>
        <Button size="sm" variant="ghost" disabled={used === 0} onClick={() => setUsed(Math.max(0, used - 12))}>
          Delete 12 GB
        </Button>
      </div>
    </div>
  )
}
