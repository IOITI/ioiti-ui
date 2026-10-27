import type { CSSProperties, ReactNode } from 'react'

import { cn } from '../lib/utils.js'

export interface DescriptionItem {
  term: ReactNode
  details: ReactNode
}

interface DescriptionListProps {
  items: DescriptionItem[]
  /**
   * `rows`: each term and its details on one line, the details at the end (a summary, a card).
   * `columns`: the terms in a column of their own, ruled rows (a record's details).
   * `grid`: each term over its details, in columns (figures side by side).
   * `inline`: one after the other in a sentence's flow (facts about a line of a list).
   */
  layout?: 'rows' | 'columns' | 'grid' | 'inline'
  /** For `grid`: how many columns, from a small screen up (one on a phone). */
  columns?: 2 | 3 | 4
  /** For `columns`: the width of the terms' column. */
  termWidth?: string
  /** Rows divided by a rule (`columns` always are). */
  divided?: boolean
  /** A border around it, its rows divided. */
  boxed?: boolean
  /** Tighter rows and smaller text. */
  compressed?: boolean
  /** The details as figures: digits of one width, so that they line up. */
  numeric?: boolean
  className?: string
}

const GRID_COLUMNS = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

/**
 * Terms and their details, a `<dl>`: what a record is, a summary, figures side by side. The terms in the
 * secondary text, their details in the primary one.
 */
export function DescriptionList({
  items,
  layout = 'rows',
  columns = 2,
  termWidth = '12rem',
  divided = false,
  boxed = false,
  compressed = false,
  numeric = false,
  className,
}: DescriptionListProps) {
  const size = compressed ? 'text-xs' : 'text-sm'
  const details = cn('text-text-primary', numeric && 'tabular-nums')

  if (layout === 'inline') {
    return (
      <dl className={cn('flex flex-wrap gap-x-4 gap-y-1', size, className)}>
        {items.map((item, index) => (
          <div key={index} className="inline-flex gap-1.5">
            <dt className="text-text-secondary">{item.term}</dt>
            <dd className={details}>{item.details}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (layout === 'grid') {
    return (
      <dl
        className={cn(
          'grid grid-cols-1 gap-x-6',
          GRID_COLUMNS[columns],
          compressed ? 'gap-y-2' : 'gap-y-3',
          boxed && 'rounded-xl border border-border p-4',
          size,
          className,
        )}
      >
        {items.map((item, index) => (
          <div key={index} className="min-w-0">
            <dt className="text-xs text-text-secondary">{item.term}</dt>
            <dd className={cn('mt-0.5 font-medium', details)}>{item.details}</dd>
          </div>
        ))}
      </dl>
    )
  }

  const pad = compressed ? 'py-1.5' : 'py-2.5'
  return (
    <dl
      className={cn(
        'flex flex-col',
        (boxed || divided || layout === 'columns') && 'divide-y divide-border',
        boxed && 'rounded-xl border border-border px-4',
        size,
        className,
      )}
    >
      {items.map((item, index) =>
        layout === 'columns' ? (
          <div
            key={index}
            className={cn('grid gap-x-4 gap-y-0.5 sm:grid-cols-[var(--term)_minmax(0,1fr)]', pad)}
            style={{ '--term': termWidth } as CSSProperties}
          >
            <dt className="text-text-secondary">{item.term}</dt>
            <dd className={cn('min-w-0 break-words', details)}>{item.details}</dd>
          </div>
        ) : (
          <div key={index} className={cn('flex items-baseline justify-between gap-3', boxed || divided ? pad : compressed ? 'py-0.5' : 'py-1')}>
            <dt className="text-text-secondary">{item.term}</dt>
            <dd className={cn('min-w-0 text-right', details)}>{item.details}</dd>
          </div>
        ),
      )}
    </dl>
  )
}
