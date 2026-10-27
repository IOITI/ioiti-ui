import type { CSSProperties, ReactNode } from 'react'

import { cn } from '../lib/utils.js'

export interface ChartLegendItem {
  label: ReactNode
  /** The series' colour, as the chart draws it: a token (`var(--chart-compare-1)`) or a colour. */
  color: string
  /**
   * How the chart draws it: a bar or an area (`square`, the default), a line, a dashed line, a point, or a moment
   * marked across the chart (`marker`: LineChart's markers, a restart).
   */
  shape?: 'square' | 'line' | 'dashed' | 'dot' | 'marker'
  /** A figure beside it: the series' total, its last value. */
  value?: ReactNode
  /** With `onToggle`: whether the chart shows it. */
  shown?: boolean
}

interface ChartLegendProps {
  items: ChartLegendItem[]
  /** Makes each item a button that shows or hides its series. The chart decides what it allows (one series left). */
  onToggle?: (index: number) => void
  /** The legend's name for a screen reader. */
  label?: string
  className?: string
}

function Swatch({ color, shape = 'square' }: { color: string; shape?: ChartLegendItem['shape'] }) {
  const style: CSSProperties = shape === 'dashed' || shape === 'marker' ? { borderColor: color } : { background: color }
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        'inline-block shrink-0',
        shape === 'square' && 'size-2.5 rounded-[3px]',
        shape === 'dot' && 'size-2 rounded-full',
        shape === 'line' && 'h-0.5 w-3.5 rounded-full',
        shape === 'dashed' && 'w-3.5 border-t-2 border-dashed',
        shape === 'marker' && 'h-3 border-l border-dashed',
      )}
    />
  )
}

/**
 * What the colours of a chart stand for, each with its swatch drawn as the chart draws it, and a figure
 * where there is one. With `onToggle`, each shows or hides its series. Also for an application's own charts.
 */
export function ChartLegend({ items, onToggle, label = 'Legend', className }: ChartLegendProps) {
  return (
    <ul aria-label={label} className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs', className)}>
      {items.map((item, index) => {
        const shown = item.shown !== false
        const content = (
          <>
            <Swatch color={item.color} shape={item.shape} />
            <span className={cn(shown ? 'text-text-secondary' : 'text-text-muted line-through')}>{item.label}</span>
            {/* A space for the name a screen reader hears: a flex row draws none. */}
            {item.value !== undefined && (
              <>
                {' '}
                <span className="tabular-nums text-text-primary">{item.value}</span>
              </>
            )}
          </>
        )
        return (
          <li key={index} className="inline-flex">
            {onToggle ? (
              <button
                type="button"
                aria-pressed={shown}
                onClick={() => onToggle(index)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors hover:bg-surface-hover',
                  !shown && '[&>[aria-hidden]]:opacity-40',
                )}
              >
                {content}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5">{content}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
