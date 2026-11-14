import { Button, LiveValue } from 'ioiti-ui'
import { useState } from 'react'

export default function LiveValueInvert() {
  const [delay, setDelay] = useState(240)
  return (
    <div className="space-y-4">
      <dl className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
        <div className="flex items-baseline gap-2">
          <dt className="text-muted-foreground">Answer time, invert</dt>
          <dd>
            <LiveValue value={delay} invert format={(value) => `${value} ms`} className="text-lg font-semibold" />
          </dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-muted-foreground">The same, flash off</dt>
          <dd>
            <LiveValue value={delay} flash={false} format={(value) => `${value} ms`} className="text-lg font-semibold" />
          </dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setDelay(Math.max(40, delay - 60))}>
          Faster
        </Button>
        <Button size="sm" variant="outline" onClick={() => setDelay(delay + 60)}>
          Slower
        </Button>
      </div>
    </div>
  )
}
