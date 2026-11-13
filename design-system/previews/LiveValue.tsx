import { Button, LiveValue } from 'ioiti-ui'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

/** A price that changes every second and a queue that waits: each change shows in its tone a moment. */
function Watched() {
  const [price, setPrice] = useState(18_120.5)
  const [queue, setQueue] = useState(42)
  const [stale, setStale] = useState(false)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPrice((now) => Math.round((now + (Math.random() - 0.5) * 12) * 100) / 100)
      setQueue((now) => Math.max(0, now + Math.round((Math.random() - 0.5) * 6)))
    }, 1500)
    return () => window.clearInterval(timer)
  }, [])
  return (
    <div className="flex flex-wrap items-center gap-8 p-5 text-sm">
      <span className="flex items-baseline gap-2">
        <span className="text-muted-foreground">Index</span>
        <LiveValue value={price} format={(value) => value.toLocaleString('en-GB', { minimumFractionDigits: 2 })} stale={stale} className="text-lg font-semibold" />
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-muted-foreground">Orders waiting</span>
        <LiveValue value={queue} invert className="text-lg font-semibold" />
      </span>
      <Button size="sm" variant="outline" onClick={() => setStale(!stale)}>
        {stale ? 'The source is back' : 'The source stops'}
      </Button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Watched />)
