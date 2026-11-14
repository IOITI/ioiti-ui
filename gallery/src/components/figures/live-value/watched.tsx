import { Button, LiveValue } from 'ioiti-ui'
import { useEffect, useState } from 'react'

// What the source sends, one a tick and again: the index moves a little, the queue up and down.
const PRICE_STEPS = [3.25, -1.5, 4.75, -6, 2.5, -0.75, 5.5, -3.25]
const QUEUE_STEPS = [2, -3, 1, 0, -2, 3, -1, 1]

export default function LiveValueWatched() {
  const [tick, setTick] = useState(0)
  const [stale, setStale] = useState(false)
  useEffect(() => {
    if (stale) return
    const timer = window.setInterval(() => setTick((now) => now + 1), 1500)
    return () => window.clearInterval(timer)
  }, [stale])
  const price = 18_120.5 + PRICE_STEPS.slice(0, tick % PRICE_STEPS.length).reduce((sum, step) => sum + step, 0)
  const queue = 42 + QUEUE_STEPS.slice(0, tick % QUEUE_STEPS.length).reduce((sum, step) => sum + step, 0)
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
      <span className="flex items-baseline gap-2">
        <span className="text-muted-foreground">Index</span>
        <LiveValue value={price} format={(value) => value.toLocaleString('en-GB', { minimumFractionDigits: 2 })} stale={stale} className="text-lg font-semibold" />
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-muted-foreground">Orders waiting</span>
        {/* Down is good for a queue: the tones swap. */}
        <LiveValue value={queue} invert stale={stale} className="text-lg font-semibold" />
      </span>
      <Button size="sm" variant="outline" onClick={() => setStale(!stale)}>
        {stale ? 'The source is back' : 'The source stops'}
      </Button>
    </div>
  )
}
