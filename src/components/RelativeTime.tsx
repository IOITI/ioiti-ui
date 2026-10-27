import { useState } from 'react'

import { formatDateTime, formatRelative } from '../lib/format.js'
import { useNow } from '../lib/now.js'
import { Hint } from './Hint.js'

const MINUTE = 60_000
const HOUR = 3_600_000

/** How often a time of this age is said again: as precisely as it is said ("12 s ago", "3 min ago", "4 d ago"). */
function intervalFor(age: number): number {
  if (age < MINUTE) return 1000
  if (age < 48 * HOUR) return MINUTE
  return HOUR
}

interface RelativeTimeProps {
  /** The moment: a `Date`, milliseconds, or an ISO string. */
  value: Date | number | string
  /** The time zone its full date is written in, in its hint; the browser's otherwise. */
  timeZone?: string
  className?: string
}

/**
 * A moment said from now ("3 min ago", "in 2 h"), kept true as time goes by, its full date in a hint and
 * for a screen reader. Every time on a page shares one clock for each precision (useNow).
 */
export function RelativeTime({ value, timeZone, className }: RelativeTimeProps) {
  const time = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value)
  const iso = Number.isNaN(time) ? '' : new Date(time).toISOString()
  const [pace, setPace] = useState(1000)
  const now = useNow(pace)
  // Said again as often as its age asks: a time a minute old needs no second.
  const wanted = intervalFor(Math.abs(now - time))
  if (wanted !== pace) setPace(wanted)

  const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const full = formatDateTime(iso, zone)
  return (
    <Hint content={full}>
      <time dateTime={iso} className={className}>
        {formatRelative(iso, now)}
        <span className="sr-only">, {full}</span>
      </time>
    </Hint>
  )
}
