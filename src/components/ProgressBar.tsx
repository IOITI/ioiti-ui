import { useId } from 'react'
import type { ReactNode } from 'react'

import { cn } from '../lib/utils.js'
import { useLinkComponent } from './link-context.js'
import { useFormat } from './locale-context.js'
import { METER_FILL, METER_TRACK, meterTone } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'

interface ProgressBarProps {
  /** What is under way: "Importing the files". */
  label: ReactNode
  /** Done so far, out of `max`. None for work whose length is not known: the bar then says it is working. */
  value?: number
  max?: number
  /**
   * The progress in words, said beside the bar and to a screen reader: "42 of 120 files". The percentage otherwise, as
   * the provider's locale writes one ("42%"; "42 %" in French).
   */
  valueText?: string
  tone?: MeterTone
  size?: 'sm' | 'md'
  className?: string
}

/**
 * How far a piece of work has come: a file imported, a run computed. For a ratio against a limit (a quota
 * used), `Meter`.
 */
export function ProgressBar({ label, value, max = 100, valueText, tone = 'neutral', size = 'md', className }: ProgressBarProps) {
  const id = useId()
  const { formatPercent } = useFormat()
  const known = value !== undefined && Number.isFinite(value)
  const ratio = known ? Math.min(Math.max(value / max, 0), 1) : 0
  const said = known ? (valueText ?? formatPercent(Math.round(ratio * 100), false, 0)) : valueText
  const drawn = meterTone(tone, 'ProgressBar')
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span id={id} className="text-text-secondary">
          {label}
        </span>
        {said && (
          <span aria-hidden className="tabular-nums text-muted-foreground">
            {said}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={known ? 0 : undefined}
        aria-valuemax={known ? max : undefined}
        aria-valuenow={known ? value : undefined}
        aria-valuetext={said}
        className={cn('w-full overflow-hidden rounded-full', size === 'sm' ? 'h-1' : 'h-1.5', METER_TRACK[drawn])}
      >
        {known ? (
          <div
            className={cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft', METER_FILL[drawn])}
            style={{ width: `${ratio * 100}%` }}
          />
        ) : (
          // Working, for how long no one knows: the fill breathes (still where motion is reduced).
          <div className={cn('h-full w-full rounded-full opacity-60 animate-pulse', METER_FILL[drawn])} />
        )}
      </div>
    </div>
  )
}

export interface BarListItem {
  label: ReactNode
  value: number
  /** Where the row leads: its label is then a link. */
  href?: string
  tone?: MeterTone
}

interface BarListProps {
  items: BarListItem[]
  /** The list's name for a screen reader. */
  label?: string
  /** The value of a full bar; the largest value otherwise. */
  max?: number
  /** Writes each figure: the provider's number by default ("1,284"; "1 284" in French). */
  format?: (value: number) => string
  className?: string
}

/**
 * Things ranked by a figure, each a row of its label, a bar and the figure: the reasons orders were
 * returned, the pages most visited. For values over categories read against an axis, `BarChart`.
 */
export function BarList({ items, label, max, format, className }: BarListProps) {
  const Link = useLinkComponent()
  const { formatNumber } = useFormat()
  const write = format ?? ((value: number) => formatNumber(value))
  const full = max ?? Math.max(1, ...items.map((item) => item.value))
  return (
    <ul aria-label={label} className={cn('flex flex-col gap-2.5', className)}>
      {items.map((item, index) => {
        const ratio = Math.min(Math.max(item.value / full, 0), 1)
        return (
          <li key={index} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm">
            <span className="truncate text-text-secondary">
              {item.href ? (
                // The application's link, held in context (LinkProvider): the same component at every render.
                // oxlint-disable-next-line react/static-components
                <Link href={item.href} className="underline-offset-2 hover:text-foreground hover:underline accent:text-brand-text">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </span>
            <span className="text-right tabular-nums text-foreground">{write(item.value)}</span>
            <span aria-hidden className={cn('col-span-2 h-1.5 overflow-hidden rounded-full', METER_TRACK[meterTone(item.tone ?? 'neutral', 'BarList')])}>
              <span
                className={cn(
                  'block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-soft',
                  METER_FILL[meterTone(item.tone ?? 'neutral', 'BarList')],
                )}
                style={{ width: `${ratio * 100}%` }}
              />
            </span>
          </li>
        )
      })}
    </ul>
  )
}
