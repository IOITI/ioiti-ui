import { useId } from 'react'

import { NEGATIVE_COLOUR, POSITIVE_COLOUR, SERIES_COLOUR } from '../lib/chart-colours.js'
import { monotonePath } from '../lib/dashboard-chart-utils.js'
import { formatNumber, toneOf } from '../lib/format.js'
import type { Tone } from '../lib/format.js'

interface SparklineProps {
  values: number[]
  /** A line (the default), or bars from zero: a gain up, a loss down. */
  variant?: 'line' | 'bars'
  /**
   * Its colour: `auto` says the direction (a line by its last value against its first, each bar by its
   * sign), a tone says one for all, `neutral` is the series colour (the accent's, where the look has one).
   * Where down is good (a delay), give the tone.
   */
  tone?: 'auto' | Tone
  /** In pixels. */
  width?: number
  height?: number
  /** What it shows ("Orders per day"): a screen reader hears it before its first, last, highest and lowest values. */
  label?: string
  format?: (value: number) => string
  className?: string
}

const COLOUR: Record<Tone, string> = { positive: POSITIVE_COLOUR, negative: NEGATIVE_COLOUR, neutral: SERIES_COLOUR }

/**
 * A small line or bars, without axes, for the trend of a figure: in a KpiTile, in a table's cell. For a
 * chart that is read, `LineChart` or `BarChart`.
 */
export function Sparkline({
  values,
  variant = 'line',
  tone = 'auto',
  width = 96,
  height = 24,
  label,
  format = (value) => formatNumber(value, Number.isInteger(value) ? 0 : 2),
  className,
}: SparklineProps) {
  const gradient = useId()
  const finite = values.filter((value) => Number.isFinite(value))
  if (finite.length === 0) return null

  const first = finite[0]
  const last = finite[finite.length - 1]
  const high = Math.max(...finite)
  const low = Math.min(...finite)
  const summary = `from ${format(first)} to ${format(last)}, high ${format(high)}, low ${format(low)}`
  const name = label ? `${label}: ${summary}` : summary
  const pad = 2

  if (variant === 'bars') {
    // Bars start at zero, which is on the scale even when every value is above it.
    const top = Math.max(high, 0)
    const bottom = Math.min(low, 0)
    const span = top - bottom || 1
    const zero = pad + ((top - 0) / span) * (height - pad * 2)
    const slot = width / finite.length
    const bar = Math.max(1, slot * 0.7)
    return (
      <svg role="img" aria-label={name} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
        {finite.map((value, index) => {
          const y = pad + ((top - Math.max(value, 0)) / span) * (height - pad * 2)
          const end = pad + ((top - Math.min(value, 0)) / span) * (height - pad * 2)
          const colour = tone === 'auto' ? COLOUR[toneOf(value)] : COLOUR[tone]
          return (
            <rect
              key={index}
              x={index * slot + (slot - bar) / 2}
              y={Math.min(y, zero)}
              width={bar}
              height={Math.max(end - y, value === 0 ? 0 : 1)}
              rx={Math.min(1.5, bar / 2)}
              fill={colour}
            />
          )
        })}
      </svg>
    )
  }

  const span = high - low || 1
  const points: [number, number][] = finite.map((value, index) => [
    pad + (finite.length === 1 ? (width - pad * 2) / 2 : (index / (finite.length - 1)) * (width - pad * 2)),
    pad + ((high - value) / span) * (height - pad * 2),
  ])
  const colour = tone === 'auto' ? COLOUR[toneOf(last - first)] : COLOUR[tone]
  const line = monotonePath(points)
  const [endX, endY] = points[points.length - 1]
  const area = `${line}L${endX.toFixed(2)} ${height}L${points[0][0].toFixed(2)} ${height}Z`

  return (
    <svg role="img" aria-label={name} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <defs>
        <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colour} stopOpacity={0.18} />
          <stop offset="100%" stopColor={colour} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradient})`} />
      <path d={line} fill="none" stroke={colour} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={endX} cy={endY} r={2} fill={colour} />
    </svg>
  )
}
