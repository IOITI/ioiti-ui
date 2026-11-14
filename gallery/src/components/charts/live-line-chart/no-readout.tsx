import { LiveLineChart } from 'ioiti-ui'
import { useCallback, useState } from 'react'

const KNOWN = [131, 126, 128, 122, 119, 124, 120, 117, 121, 118]

export default function LiveLineChartNoReadout() {
  const [waiting, setWaiting] = useState(KNOWN[KNOWN.length - 1])
  // Its source tells the page too, which draws the figure where it wants it: in the box's header.
  const queue = useCallback((push: (value: number) => void) => {
    let value = KNOWN[KNOWN.length - 1]
    const timer = window.setInterval(() => {
      value = Math.max(0, Math.round(value + (Math.random() - 0.48) * 20))
      push(value)
      setWaiting(value)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <div className="max-w-sm rounded-2xl border border-border/70 bg-surface/50 p-4 dark:bg-surface/25">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">Jobs waiting</span>
        <span className="text-lg font-semibold tabular-nums">{waiting}</span>
      </div>
      <LiveLineChart ariaLabel="Jobs waiting in the queue" source={queue} initial={KNOWN} windowSeconds={30} height={96} showReadout={false} />
    </div>
  )
}
