import { RelativeTime } from 'ioiti-ui'
import { useState } from 'react'

export default function RelativeTimePast() {
  // A message received now, stamped by a server whose clock is 3 seconds ahead of this one.
  const [received] = useState(() => Date.now() + 3000)
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
      <span>
        Received <RelativeTime value={received} timeZone="Europe/Paris" past />
      </span>
      <span className="text-muted-foreground">
        Without past: <RelativeTime value={received} timeZone="Europe/Paris" />
      </span>
    </div>
  )
}
