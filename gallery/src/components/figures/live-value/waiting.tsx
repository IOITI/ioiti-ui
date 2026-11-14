import { Button, LiveValue } from 'ioiti-ui'
import { useState } from 'react'

export default function LiveValueWaiting() {
  // Nothing has come yet.
  const [visitors, setVisitors] = useState<number | null>(null)
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
      <span className="flex items-baseline gap-2">
        <span className="text-muted-foreground">Visitors now</span>
        <LiveValue value={visitors} className="text-lg font-semibold" />
      </span>
      <Button size="sm" variant="outline" onClick={() => setVisitors(visitors === null ? 128 : visitors + 7)}>
        {visitors === null ? 'The first figure comes' : 'Seven more'}
      </Button>
      <Button size="sm" variant="ghost" disabled={visitors === null} onClick={() => setVisitors(null)}>
        Start again
      </Button>
    </div>
  )
}
