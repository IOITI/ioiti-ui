import { useEffect, useState } from 'react'

import { formatNumber } from '../lib/format.js'
import { cn } from '../lib/utils.js'

interface LiveValueProps {
  /** The figure now; `null` (or `NaN`) while there is none. */
  value: number | null
  format?: (value: number) => string
  /** The figure is old: what sends it stopped. It is muted, and a screen reader hears that it is stale. */
  stale?: boolean
  /** A change shows in its tone a moment: up in the gain colour, down in the loss colour. */
  flash?: boolean
  /** Where down is good (a delay, a cost): the tones swap. */
  invert?: boolean
  /** The word a screen reader hears for a stale figure. */
  staleLabel?: string
  className?: string
}

/** How long a change keeps its tone, and how long it then takes to fade back. */
const HOLD = 600
const FADE = 500

/**
 * A figure that changes as it is watched (a price, a queue's length): each change shows in its tone a
 * moment, then fades back; a figure gone stale is muted. A fade, so it stays where motion is reduced. For a
 * signed amount, `SignedValue`; for a count that rolls, `AnimatedNumber`.
 */
export function LiveValue({
  value: given,
  format = (number) => formatNumber(number, Number.isInteger(number) ? 0 : 2),
  stale = false,
  flash = true,
  invert = false,
  staleLabel = 'stale',
  className,
}: LiveValueProps) {
  // NaN is no figure, as null: never equal to itself, it would be a new figure at every render, each asking
  // for another.
  const value = Number.isNaN(given) ? null : given
  const [previous, setPrevious] = useState(value)
  const [change, setChange] = useState<{ up: boolean; at: number } | null>(null)
  const [fading, setFading] = useState(false)
  if (value !== previous) {
    setPrevious(value)
    if (flash && value !== null && previous !== null) {
      setChange({ up: value > previous, at: (change?.at ?? 0) + 1 })
      setFading(false)
    }
  }

  useEffect(() => {
    if (!change) return
    const hold = setTimeout(() => setFading(true), HOLD)
    const done = setTimeout(() => {
      setChange(null)
      setFading(false)
    }, HOLD + FADE)
    return () => {
      clearTimeout(hold)
      clearTimeout(done)
    }
  }, [change])

  const good = change && change.up !== invert
  return (
    <span
      className={cn(
        'tabular-nums',
        stale && 'text-text-muted',
        // The tone at once; then back, in a fade.
        change && !fading && !stale && (good ? 'text-positive' : 'text-negative'),
        change && fading ? 'transition-colors duration-500 ease-soft' : 'transition-none',
        className,
      )}
    >
      {value === null ? '—' : format(value)}
      {stale && <span className="sr-only"> ({staleLabel})</span>}
    </span>
  )
}
