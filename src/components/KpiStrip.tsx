import { useId } from 'react'
import type { ReactNode } from 'react'

import type { GoodWhen } from '../lib/change.js'
import { cn } from '../lib/utils.js'
import { KpiChange } from './KpiChange.js'

/** One figure of a strip: what KpiTile takes. */
export interface KpiStripItem {
  label: string
  value: ReactNode
  hint?: ReactNode
  /** Its change, signed: a percentage by default (`2.5` is "+2.5%"). */
  change?: number
  goodWhen?: GoodWhen
  changeFormat?: (change: number) => string
}

export interface KpiStripProps {
  items: KpiStripItem[]
  /** Its heading. */
  title?: ReactNode
  /** What the changes are compared with, said once ("Compared with yesterday"). */
  period?: ReactNode
  /** How many side by side on a wide screen: as many as there are figures, six at most, by default. */
  columns?: 2 | 3 | 4 | 5 | 6
  className?: string
}

// Written out whole for Tailwind to find them: two on a phone, three on a tablet, the columns asked from a laptop up.
const COLUMNS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}

/**
 * Secondary figures in one panel, divided by hairlines: fewer columns on a narrower screen, the hairlines
 * between them however they wrap (each figure draws its left and top ones, the frame cuts those at its
 * edge).
 */
export function KpiStrip({ items, title, period, columns, className }: KpiStripProps) {
  const periodId = useId()
  const shown = columns ?? (Math.min(Math.max(items.length, 2), 6) as 2 | 3 | 4 | 5 | 6)
  return (
    <section className={cn('min-w-0 rounded-2xl border border-border/70 bg-surface/50 text-foreground dark:bg-surface/25 glass-card glass-edge', className)}>
      {(title || period) && (
        <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/70 px-5 py-3">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {period && (
            <p id={periodId} className="text-xs text-muted-foreground">
              {period}
            </p>
          )}
        </header>
      )}
      <div className="overflow-hidden rounded-[inherit]">
        <dl aria-describedby={period ? periodId : undefined} className={cn('-mt-px -ml-px grid', COLUMNS[shown])}>
          {items.map((item) => (
            <div key={item.label} className="min-w-0 border-t border-l border-border/70 px-5 py-4">
              <dt className="truncate text-xs text-muted-foreground">{item.label}</dt>
              <dd className="mt-1.5 text-lg font-semibold tracking-tight">{item.value}</dd>
              {(item.change !== undefined || item.hint) && (
                <dd className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  {item.change !== undefined && <KpiChange change={item.change} goodWhen={item.goodWhen} format={item.changeFormat} />}
                  {item.hint && <span>{item.hint}</span>}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
