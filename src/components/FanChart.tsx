import { motion, useReducedMotionConfig } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { AXIS_COLOUR, GRID_COLOUR, MUTED_COLOUR, seriesColours } from '../lib/chart-colours.js'
import { detailsText } from '../lib/chart-details.js'
import type { ChartDetail } from '../lib/chart-details.js'
import { Tooltip, defaultFormat, defaultTick, useDismissOutside, useElementWidth } from '../lib/chart-primitives.js'
import { niceDomain, niceStep } from '../lib/chart-scale.js'
import { monotonePath } from '../lib/dashboard-chart-utils.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { cn } from '../lib/utils.js'
import { ChartLegend } from './ChartLegend.js'
import { METER_COLOUR } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'

/** A place on the x axis (`x`: a count, a distance, a step) and each key's value there; `null` is nothing there. */
export type FanPoint = { x: number } & Record<string, number | null>

export interface FanBand {
  /** The keys of the band's lower and upper edges. */
  lower: string
  upper: string
  label: string
  /** Its colour; the muted one of the charts otherwise. Bands drawn one over the other deepen it. */
  color?: string
}

export interface FanLine {
  key: string
  label: string
  /** A colour of its own; the design's otherwise (one line in the series colour, more in the compare colours). */
  color?: string
  /** Drawn dashed: what was expected, a median. */
  dashed?: boolean
}

export interface FanReference {
  value: number
  label?: string
  tone?: MeterTone
}

export interface FanMarker {
  x: number
  label: string
}

export interface FanChartProps {
  /** Sorted by `x`. */
  data: FanPoint[]
  /** The ranges expected, widest first: each a filled band between two keys. */
  bands: FanBand[]
  /** Lines over the bands: what was expected (dashed), what happened. */
  lines: FanLine[]
  /** Horizontal lines: a limit, zero. */
  references?: FanReference[]
  /** Places marked across the chart: when something changed. */
  markers?: FanMarker[]
  /** Zero kept on the value axis, or the axis fitted to the values. */
  zero?: boolean
  height?: number
  formatValue?: (value: number) => string
  formatTick?: (value: number) => string
  /** A place on the x axis in words: "Trade 12". */
  formatX?: (x: number) => string
  /** A place on the x axis on its ticks: "12"; `formatX` otherwise. */
  formatXTick?: (x: number) => string
  /** What the x axis counts, under it: "Trades". */
  xLabel?: string
  /** More to say of a place, in the tooltip and the table. */
  details?: (point: FanPoint, index: number) => ChartDetail[]
  showLegend?: boolean
  /** Lines drawn in when they first show (not where motion is reduced). */
  animated?: boolean
  ariaLabel?: string
  className?: string
}

const valueOf = (point: FanPoint, key: string): number | null => {
  const value = point[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/** The points of a line, split where a value is missing. */
function segments(points: (readonly [number, number] | null)[]): [number, number][][] {
  const out: [number, number][][] = []
  let current: [number, number][] = []
  for (const point of points) {
    if (point) current.push([point[0], point[1]])
    else if (current.length) {
      out.push(current)
      current = []
    }
  }
  if (current.length) out.push(current)
  return out
}

/** A band's outline over the places that have both its edges: the upper edge forward, the lower one back. */
function bandPaths(data: FanPoint[], band: FanBand, x: (value: number) => number, y: (value: number) => number): string[] {
  const parts: [number, number, number][][] = []
  let current: [number, number, number][] = []
  for (const point of data) {
    const low = valueOf(point, band.lower)
    const high = valueOf(point, band.upper)
    if (low !== null && high !== null) current.push([x(point.x), y(low), y(high)])
    else if (current.length) {
      parts.push(current)
      current = []
    }
  }
  if (current.length) parts.push(current)
  return parts.map((part) => {
    const upper = part.map(([px, , high]) => `${px.toFixed(2)} ${high.toFixed(2)}`)
    const lower = [...part].reverse().map(([px, low]) => `${px.toFixed(2)} ${low.toFixed(2)}`)
    return `M${upper.join('L')}L${lower.join('L')}Z`
  })
}

/** Ticks inside a range of x, at a nice step: none beyond the data. */
function xTicks(min: number, max: number, count: number): number[] {
  if (max === min) return [min]
  const step = niceStep((max - min) / count)
  const ticks: number[] = []
  for (let tick = Math.ceil(min / step) * step; tick <= max + step / 1e6; tick += step) ticks.push(Number(tick.toFixed(10)))
  return ticks
}

/** The index of the point nearest a place, in data sorted by x. */
function nearest(places: number[], at: number): number {
  let low = 0
  let high = places.length - 1
  while (low < high) {
    const middle = (low + high) >> 1
    if (places[middle] < at) low = middle + 1
    else high = middle
  }
  return low > 0 && at - places[low - 1] < places[low] - at ? low - 1 : low
}

/**
 * What was expected as ranges that widen, and what happened over them: the bands of a forecast or of a
 * simulation (where 90 % and 50 % of its paths went), its median dashed, the actual line drawn as far as it
 * goes. The x axis is a count or a measure, not a time (for values over time, `LineChart`). Its places are read
 * by pointer or keyboard, and given to screen readers as a table.
 */
export function FanChart({
  data,
  bands,
  lines,
  references = [],
  markers = [],
  zero = false,
  height = 260,
  formatValue = defaultFormat,
  formatTick = defaultTick,
  formatX = (value: number) => defaultFormat(value),
  formatXTick,
  xLabel,
  details,
  showLegend = true,
  animated = true,
  ariaLabel,
  className,
}: FanChartProps) {
  const reduce = useReducedMotionConfig()
  const draw = animated && !reduce
  const [rootRef, width] = useElementWidth<HTMLDivElement>(640)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState<string[]>([])
  const [active, setActive] = useState<number | null>(null)
  useDismissOutside(
    wrapRef,
    active !== null,
    useCallback(() => setActive(null), []),
  )

  const lineColours = seriesColours(lines.map((line) => line.color))
  const shownLines = lines.map((line, index) => ({ ...line, color: lineColours[index] })).filter((line) => !hidden.includes(line.key))
  const shownBands = bands.map((band) => ({ ...band, color: band.color ?? MUTED_COLOUR })).filter((band) => !hidden.includes(band.label))
  const places = data.map((point) => point.x)
  const n = data.length

  if (n === 0) return <p className="py-10 text-center text-sm text-muted-foreground">No data</p>

  const keys = [...shownLines.map((line) => line.key), ...shownBands.flatMap((band) => [band.lower, band.upper])]
  const values = keys.flatMap((key) => data.map((point) => valueOf(point, key))).filter((value): value is number => value !== null)
  const limits = references.map((reference) => reference.value)
  const domain = niceDomain(Math.min(...values, ...limits), Math.max(...values, ...limits), 4, zero)
  const tickText = domain.ticks.map(formatTick)
  const xTickText = formatXTick ?? formatX

  const M = {
    top: 14,
    right: 12,
    bottom: xLabel ? 40 : 24,
    left: Math.ceil(Math.max(...tickText.map((text) => text.length)) * 6.4) + 12,
  }
  const iw = Math.max(10, width - M.left - M.right)
  const ih = height - M.top - M.bottom
  const xMin = places[0]
  const xMax = places[n - 1]
  const x = (value: number) => M.left + (xMax === xMin ? iw / 2 : ((value - xMin) / (xMax - xMin)) * iw)
  const y = (value: number) => M.top + ((domain.max - value) / (domain.max - domain.min)) * ih
  const axis = xTicks(xMin, xMax, Math.max(2, Math.floor(iw / 80)))

  const drawn = shownLines.map((line) => {
    const points = data.map((point) => {
      const value = valueOf(point, line.key)
      return value === null ? null : ([x(point.x), y(value)] as const)
    })
    return { ...line, parts: segments(points) }
  })
  const detailsOf = (index: number) => details?.(data[index], index) ?? []

  const pick = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const at = xMin + ((event.clientX - box.left) / Math.max(1, box.width)) * (xMax - xMin)
    setActive(nearest(places, at))
  }
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const page = Math.max(1, Math.round(n / 10))
    const move: Record<string, (at: number | null) => number | null> = {
      ArrowRight: (at) => Math.min(n - 1, (at ?? -1) + 1),
      ArrowLeft: (at) => Math.max(0, (at ?? n) - 1),
      PageUp: (at) => Math.min(n - 1, (at ?? -1) + page),
      PageDown: (at) => Math.max(0, (at ?? n) - page),
      Home: () => 0,
      End: () => n - 1,
      Escape: () => null,
    }
    const go = move[event.key]
    if (!go) return
    event.preventDefault()
    setActive(go)
  }
  const legendItems = [
    ...lines.map((line, index) => ({ id: line.key, label: line.label, color: lineColours[index], shape: line.dashed ? ('dashed' as const) : ('line' as const) })),
    ...bands.map((band) => ({ id: band.label, label: band.label, color: band.color ?? MUTED_COLOUR, shape: 'square' as const })),
  ]
  const toggle = (index: number) => {
    const id = legendItems[index].id
    setHidden((now) => (now.includes(id) ? now.filter((each) => each !== id) : legendItems.length - now.length > 1 ? [...now, id] : now))
  }

  const activeX = active === null ? 0 : x(places[active])
  const activeValues =
    active === null
      ? []
      : keys.map((key) => valueOf(data[active], key)).filter((value): value is number => value !== null)
  const activeTop = activeValues.length ? Math.min(...activeValues.map(y)) : M.top
  const bandText = (point: FanPoint, band: FanBand) => {
    const low = valueOf(point, band.lower)
    const high = valueOf(point, band.upper)
    return low === null || high === null ? '—' : `${formatValue(low)} to ${formatValue(high)}`
  }

  return (
    // As wide as its container, never as what it drew (contain-inline-size, see useElementWidth).
    <div ref={rootRef} className={cn('w-full contain-inline-size', className)}>
      <div ref={wrapRef} className="relative" style={{ height }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel ?? `Fan chart of ${lines.map((line) => line.label).join(', ')}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="block touch-pan-y overflow-visible rounded-lg"
        >
          {domain.ticks.map((tick, index) => (
            <g key={tick}>
              <line x1={M.left} x2={width - M.right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? AXIS_COLOUR : GRID_COLOUR} />
              <text x={M.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[11px] tabular-nums">
                {tickText[index]}
              </text>
            </g>
          ))}

          {axis.map((tick) => (
            <text key={tick} x={x(tick)} y={M.top + ih + 16} textAnchor="middle" className="fill-muted-foreground text-[11px] tabular-nums">
              {xTickText(tick)}
            </text>
          ))}
          {xLabel && (
            <text x={M.left + iw / 2} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {xLabel}
            </text>
          )}

          {shownBands.map((band) =>
            bandPaths(data, band, x, y).map((d, index) => (
              <motion.path
                key={`${band.label}-${index}`}
                data-band={band.label}
                d={d}
                fill={band.color}
                fillOpacity={0.18}
                stroke="none"
                initial={draw ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={motionTransitions.easeSoft}
              />
            )),
          )}

          {markers.map((marker) => {
            const at = x(marker.x)
            return (
              <g key={`${marker.label}-${marker.x}`}>
                <line x1={at} x2={at} y1={M.top} y2={M.top + ih} stroke={AXIS_COLOUR} strokeDasharray="3 3" />
                <text x={at + 4} y={M.top + 2} dominantBaseline="hanging" className="fill-muted-foreground text-[11px]">
                  {marker.label}
                </text>
              </g>
            )
          })}

          {drawn.map((line) =>
            line.parts.map((part, index) =>
              part.length === 1 ? (
                <circle key={`${line.key}-${index}`} cx={part[0][0]} cy={part[0][1]} r={2.5} fill={line.color} />
              ) : (
                <motion.path
                  key={`${line.key}-${index}`}
                  data-line={line.key}
                  d={monotonePath(part)}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={line.dashed ? 1.5 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={line.dashed ? '5 4' : undefined}
                  // A dashed line fades in: drawing it in would undo its dashes.
                  initial={draw ? (line.dashed ? { opacity: 0 } : { pathLength: 0 }) : false}
                  animate={line.dashed ? { opacity: 1 } : { pathLength: 1 }}
                  transition={motionTransitions.easeSoft}
                />
              ),
            ),
          )}

          {references.map((reference) => (
            <g key={`${reference.value}-${reference.label ?? ''}`}>
              <line
                x1={M.left}
                x2={width - M.right}
                y1={y(reference.value)}
                y2={y(reference.value)}
                stroke={METER_COLOUR[reference.tone ?? 'neutral']}
                strokeDasharray="6 4"
                strokeWidth={1.25}
              />
              {reference.label && (
                <text x={width - M.right} y={y(reference.value) - 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
                  {reference.label}
                </text>
              )}
            </g>
          ))}

          {active !== null && (
            <g>
              <line x1={activeX} x2={activeX} y1={M.top} y2={M.top + ih} stroke={AXIS_COLOUR} />
              {shownLines.map((line) => {
                const value = valueOf(data[active], line.key)
                return value === null ? null : (
                  <circle key={line.key} cx={activeX} cy={y(value)} r={3.5} fill={line.color} className="stroke-surface" strokeWidth={1.5} />
                )
              })}
            </g>
          )}

          <rect
            x={M.left}
            y={M.top}
            width={iw}
            height={ih}
            fill="transparent"
            onPointerMove={pick}
            onPointerDown={pick}
            onPointerLeave={(event) => event.pointerType === 'mouse' && setActive(null)}
          />
        </svg>

        <Tooltip pos={active === null ? null : { x: activeX, y: activeTop }} boundsWidth={width}>
          {active !== null && (
            <>
              <p className="mb-1.5 font-medium text-foreground">{formatX(places[active])}</p>
              <ul className="space-y-1">
                {shownLines.map((line) => {
                  const value = valueOf(data[active], line.key)
                  return (
                    <li key={line.key} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: line.color }} />
                        {line.label}
                      </span>
                      <span className="tabular-nums text-foreground">{value === null ? '—' : formatValue(value)}</span>
                    </li>
                  )
                })}
                {shownBands.map((band) => (
                  <li key={band.label} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span aria-hidden className="inline-block size-2 rounded-[3px] opacity-60" style={{ background: band.color }} />
                      {band.label}
                    </span>
                    <span className="tabular-nums text-foreground">{bandText(data[active], band)}</span>
                  </li>
                ))}
              </ul>
              {detailsOf(active).length > 0 && (
                <ul className="mt-1.5 space-y-1 border-t border-border pt-1.5">
                  {detailsOf(active).map((detail) => (
                    <li key={detail.label} className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="tabular-nums text-foreground">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Tooltip>
      </div>

      {showLegend && legendItems.length > 1 && (
        <ChartLegend
          label="Series"
          className="mt-3"
          items={legendItems.map((item) => ({ label: item.label, color: item.color, shape: item.shape, shown: !hidden.includes(item.id) }))}
          onToggle={toggle}
        />
      )}

      {/* The table in a box of its own: a table is never narrower than its rows (see LineChart). */}
      <div className="sr-only">
        <table>
          <caption>{ariaLabel ?? 'Chart data'}</caption>
          <thead>
            <tr>
              <th scope="col">{xLabel ?? 'Place'}</th>
              {lines.map((line) => (
                <th key={line.key} scope="col">
                  {line.label}
                </th>
              ))}
              {bands.map((band) => (
                <th key={band.label} scope="col">
                  {band.label}
                </th>
              ))}
              {details && <th scope="col">Details</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((point, index) => (
              <tr key={point.x}>
                <th scope="row">{formatX(point.x)}</th>
                {lines.map((line) => {
                  const value = valueOf(point, line.key)
                  return <td key={line.key}>{value === null ? '—' : formatValue(value)}</td>
                })}
                {bands.map((band) => (
                  <td key={band.label}>{bandText(point, band)}</td>
                ))}
                {details && <td>{detailsText(detailsOf(index))}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
