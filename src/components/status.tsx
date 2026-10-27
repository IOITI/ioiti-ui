import { useState } from 'react'
import type { ReactNode } from 'react'

import { formatMoney, formatPercent, toneOf } from '../lib/format.js'
import { HEALTH_STATUS_LABEL } from '../lib/health.js'
import type { HealthStatus } from '../lib/health.js'
import type { Tone } from '../lib/format.js'
import { cn } from '../lib/utils.js'
import { Alert, AlertDescription, AlertTitle } from './ui/alert.js'
import { AnimatedNumber } from './ui/animated-number.js'
import { Badge } from './ui/badge.js'
import type { BadgeTone } from './ui/badge.js'
import { Skeleton } from './ui/skeleton.js'

const HEALTH_TONE: Record<HealthStatus, BadgeTone> = {
  ok: 'success',
  warning: 'warning',
  down: 'danger',
  unknown: 'neutral',
  disabled: 'neutral',
}

/** A state: always a word next to the colour, never the colour alone. */
export function StatusBadge({ status, label }: { status: HealthStatus; label?: string }) {
  return (
    <Badge tone={HEALTH_TONE[status]} dot={status !== 'disabled'}>
      {label ?? HEALTH_STATUS_LABEL[status]}
    </Badge>
  )
}

const TONE_TEXT: Record<Tone, string> = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: 'text-foreground/80',
}

/** A gain or a loss, a change: signed, so the sign carries the meaning and the colour repeats it. */
export function SignedValue({
  value,
  kind,
  currency,
  className,
  animate = false,
  stale = false,
  staleLabel = 'stale',
}: {
  value: number | null | undefined
  kind: 'money' | 'percent'
  /** For money: the currency's code (EUR by default). */
  currency?: string | null
  className?: string
  /** Its digits roll to each new value: for a figure that changes in front of the user. */
  animate?: boolean
  /**
   * The figure is old: what sends it stopped (a live result no longer published). It is muted, as `LiveValue`
   * mutes one, its sign telling a gain from a loss still, and a screen reader hears that it is stale.
   */
  stale?: boolean
  /** The word a screen reader hears for a stale figure. */
  staleLabel?: string
}) {
  const text = kind === 'money' ? formatMoney(value, currency ?? 'EUR', true) : formatPercent(value, true)
  const tone = stale ? 'text-text-muted' : TONE_TEXT[toneOf(value)]
  const said = stale && <span className="sr-only"> ({staleLabel})</span>
  if (animate && typeof value === 'number' && Number.isFinite(value)) {
    // The number first in both cases: it is not drawn again (its digits rolled anew) as it goes stale.
    return (
      <>
        <AnimatedNumber value={value} text={text} className={cn(tone, className)} />
        {said}
      </>
    )
  }
  return (
    <span className={cn('tabular-nums', tone, className)}>
      {text}
      {said}
    </span>
  )
}

interface QueryStateProps {
  isPending: boolean
  error: Error | null
  /** There is data from an earlier fetch: keep showing it and report the failure above it. */
  hasData: boolean
  skeleton?: ReactNode
  children: ReactNode
}

/**
 * Loading and failure states shared by the pages. A failed refresh never blanks what is on screen.
 * What arrives where a skeleton was fades in (animate-reveal); what is there from the start is shown
 * as it is.
 */
export function QueryState({ isPending, error, hasData, skeleton, children }: QueryStateProps) {
  const waiting = isPending && !hasData
  const [waited, setWaited] = useState(waiting)
  if (waiting && !waited) setWaited(true)
  if (waiting) {
    return skeleton ?? <Skeleton className="h-40 w-full rounded-2xl" />
  }
  return (
    <>
      {error && (
        <Alert tone="danger" role="alert">
          <AlertTitle>{hasData ? 'Could not refresh: showing the last data received' : 'Could not load'}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {hasData &&
        (waited ? (
          // No box of its own: what it holds keeps its place among the page's (a column's gaps, a grid's cells).
          <div className="contents [&>*]:animate-reveal">{children}</div>
        ) : (
          children
        ))}
    </>
  )
}
