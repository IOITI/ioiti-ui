import { Button, SignedValue } from 'ioiti-ui'
import { useState } from 'react'

// The values the result goes through, one a click.
const RESULTS = [12.4, 13.15, 9.8, -2.35, -0.6, 4.05]

export default function SignedValueRolling() {
  const [at, setAt] = useState(0)
  const [stale, setStale] = useState(false)
  const value = RESULTS[at]
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <SignedValue value={value} kind="percent" animate stale={stale} className="text-2xl font-semibold" />
      <SignedValue value={value * 34.2} kind="money" animate stale={stale} className="text-sm" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setAt((at + 1) % RESULTS.length)}>
          Change it
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStale(!stale)}>
          {stale ? 'The source is back' : 'The source stops'}
        </Button>
      </div>
    </div>
  )
}
