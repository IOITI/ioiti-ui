import { useId } from 'react'
import type { ReactNode } from 'react'

import type { GoodWhen } from '../lib/change.js'
import { cn } from '../lib/utils.js'
import { KpiChange } from './KpiChange.js'
import { METER_FILL, METER_TRACK } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'

interface KpiTileBaseProps {
  label: string
  /** The figure. Proportional digits: tabular ones look loose at this size. */
  value: ReactNode
  /** One line of context under the figure (the limit, the period...). */
  hint?: ReactNode
  /**
   * The figure's change, signed and in the tone of what it means: a percentage by default (`2.5` is
   * "+2.5%"), what `changeFormat` writes otherwise. What it is compared with is said once, by KpiGrid's
   * `period`, or by `hint`.
   */
  change?: number
  /** Which way is good news: `down` for a cost, a latency, a churn. Up by default. */
  goodWhen?: GoodWhen
  /** Writes the change, signed (`(n) => formatMoney(n, 'EUR', true)`). */
  changeFormat?: (change: number) => string
  /** The tile that leads a row: two columns wide, its chart beside the figure from a tablet up. */
  lead?: boolean
  /** A meter or a sparkline. */
  children?: ReactNode
  className?: string
}

/** A tile that needs attention: a faint tint of its tone, and always its word, never the colour alone. */
type KpiTileToneProps =
  | { tone?: undefined; toneLabel?: undefined }
  | {
      tone: 'warning' | 'negative'
      /** What the tone says, in a word or two: "Near the limit", "Failing". */
      toneLabel: string
    }

export type KpiTileProps = KpiTileBaseProps & KpiTileToneProps

// Under the content (the tile isolates it): 5 %, its text still at 4.5:1 on every surface of every look.
const TONE_TINT = { warning: 'bg-warning/5', negative: 'bg-negative/5' }
const TONE_BORDER = { warning: 'border-warning/40', negative: 'border-negative/40' }
const TONE_TEXT = { warning: 'text-warning', negative: 'text-negative' }

export function KpiTile({ label, value, hint, change, goodWhen, changeFormat, lead = false, tone, toneLabel, children, className }: KpiTileProps) {
  return (
    <div
      className={cn(
        'relative isolate flex min-h-[7.5rem] min-w-0 flex-col rounded-2xl border border-border/70 bg-surface/50 p-4 sm:p-5 dark:bg-surface/25 glass-tile glass-edge',
        lead && 'col-span-2 sm:flex-row sm:items-end sm:gap-6',
        // A tile that needs attention has no glow under glass: its tint and the glow together took its text under 4.5:1.
        tone && cn(TONE_BORDER[tone], '[--glass-tile-glow:transparent]'),
        className,
      )}
    >
      {tone && <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 rounded-[inherit]', TONE_TINT[tone])} />}
      <div className={cn('min-w-0', lead && 'sm:flex-1')}>
        {/* The tone's word goes under the label where both do not fit (a tile of a phone's two columns). */}
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
          <p className="min-w-0 text-xs text-muted-foreground">{label}</p>
          {tone && (
            <p className={cn('inline-flex shrink-0 items-center gap-1.5 text-xs font-medium', TONE_TEXT[tone])}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {toneLabel}
            </p>
          )}
        </div>
        <p className={cn('mt-2 text-xl font-semibold tracking-tight sm:text-2xl', lead && 'sm:text-3xl')}>{value}</p>
        {change === undefined ? (
          hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : (
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <KpiChange change={change} goodWhen={goodWhen} format={changeFormat} />
            {hint && <span>{hint}</span>}
          </p>
        )}
      </div>
      {children && <div className={cn('mt-auto pt-3', lead && 'sm:mt-0 sm:min-w-0 sm:flex-1 sm:pt-0')}>{children}</div>}
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
  /**
   * What the tiles' changes are compared with, said once above the row ("Compared with yesterday"), not in
   * every tile; a screen reader hears it with the tiles.
   */
  period?: ReactNode
  /** The grid's own classes. */
  className?: string
  children: ReactNode
}

/**
 * Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. A lead
 * tile takes two of them, a whole row on a phone. Under glass, each of four tiles in a row has its glow
 * from another corner (glass.css).
 */
export function KpiGrid({ columns = 4, period, className, children }: KpiGridProps) {
  const periodId = useId()
  const grid = (
    <div
      role={period ? 'group' : undefined}
      aria-describedby={period ? periodId : undefined}
      className={cn('grid gap-3 sm:gap-4', COLUMNS[columns], className)}
    >
      {children}
    </div>
  )
  if (!period) return grid
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p id={periodId} className="text-xs text-muted-foreground">
        {period}
      </p>
      {grid}
    </div>
  )
}
