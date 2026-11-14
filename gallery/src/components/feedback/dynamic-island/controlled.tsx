import { Button, DynamicIsland, ProgressBar } from 'ioiti-ui'
import type { DynamicIslandState } from 'ioiti-ui'
import { useState } from 'react'

export default function DynamicIslandControlled() {
  const [state, setState] = useState<DynamicIslandState>('collapsed')
  return (
    <div className="flex min-h-44 flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setState('expanded')}>
          Open it from the page
        </Button>
        <span className="text-sm text-muted-foreground">State: {state}</span>
      </div>
      <DynamicIsland
        label="Import"
        state={state}
        onStateChange={setState}
        compact={<span className="text-xs tabular-nums">Importing · 42 %</span>}
      >
        <div className="space-y-3 pr-6">
          <p className="text-sm font-medium">Importing the catalogue</p>
          <ProgressBar label="Products" value={504} max={1204} valueText="504 of 1,204" size="sm" />
          <p className="text-xs text-muted-foreground">It goes on if this page is left.</p>
        </div>
      </DynamicIsland>
    </div>
  )
}
