import { RelativeTime } from 'ioiti-ui'
import { useState } from 'react'

const SECOND = 1000
const HOUR = 3_600_000
const DAY = 86_400_000

export default function RelativeTimeAges() {
  // The moment the page was opened, read once: each time below is said from it, then from now.
  const [opened] = useState(() => Date.now())
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
      <span>
        Seen <RelativeTime value={opened - 20 * SECOND} timeZone="Europe/Paris" />
      </span>
      <span>
        Imported <RelativeTime value={opened - 3 * HOUR} timeZone="Europe/Paris" />
      </span>
      <span>
        Created <RelativeTime value={opened - 9 * DAY} timeZone="Europe/Paris" />
      </span>
      <span>
        Due <RelativeTime value={opened + 2 * HOUR} timeZone="Europe/Paris" />
      </span>
      <span>
        Renewed <RelativeTime value={opened + 30 * DAY} timeZone="Europe/Paris" />
      </span>
    </div>
  )
}
