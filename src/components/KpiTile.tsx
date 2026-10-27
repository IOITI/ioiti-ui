import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { METER_FILL, METER_TRACK } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'

interface KpiTileProps {
  label: string
  /** The figure. Proportional digits: tabular ones look loose at this size. */
  value: ReactNode
  /** One line of context under the figure (the limit, the period...). */
  hint?: ReactNode
  /** A meter or a sparkline. */
  children?: ReactNode
  className?: string
}

export function KpiTile({ label, value, hint, children, className }: KpiTileProps) {
  return (
    <div
      className={cn(
        'flex min-h-[7.5rem] min-w-0 flex-col rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-5 dark:bg-surface/25 glass-card',
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {children && <div className="mt-auto pt-3">{children}</div>}
    </div>
  )
}

interface MeterProps {
  /** 0 to 1. */
  ratio: number
  tone?: MeterTone
  label: string
  /** What the two ends of the bar stand for, written under it. */
  scale?: [string, string]
}

/** A single ratio against a limit. */
export function Meter({ ratio, tone = 'neutral', label, scale }: MeterProps) {
  const clamped = Math.min(Math.max(ratio, 0), 1)
  return (
    <div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        className={cn('h-1.5 w-full overflow-hidden rounded-full', METER_TRACK[tone])}
      >
        {/* A new ratio slides to its place: the change is seen. */}
        <div
          className={cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft', METER_FILL[tone])}
          style={{ width: `${clamped * 100}%` }}
        />
      </div>
      {scale && (
        <div aria-hidden className="mt-1 flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </div>
      )}
    </div>
  )
}

// Written out whole for Tailwind to find them: two on a phone, the columns asked from a wide screen up.
const COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 xl:grid-cols-4',
  5: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  6: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

interface KpiGridProps {
  /** How many tiles side by side on a wide screen (1280 px; three from 1024 for five or six): four by default. */
  columns?: 2 | 3 | 4 | 5 | 6
  className?: string
  children: ReactNode
}

/** Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. */
export function KpiGrid({ columns = 4, className, children }: KpiGridProps) {
  return <div className={cn('grid gap-3 sm:gap-4', COLUMNS[columns], className)}>{children}</div>
}
