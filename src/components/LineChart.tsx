import { motion, useReducedMotionConfig } from 'framer-motion'
import { useCallback, useId, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { GRID_COLOUR, AXIS_COLOUR, seriesColours } from '../lib/chart-colours.js'
import { detailsText } from '../lib/chart-details.js'
import type { ChartDetail } from '../lib/chart-details.js'
import { Tooltip, defaultFormat, defaultTick, useDismissOutside, useElementWidth } from '../lib/chart-primitives.js'
import { formatTimeTick, niceDomain, timeTicks } from '../lib/chart-scale.js'
import { monotonePath } from '../lib/dashboard-chart-utils.js'
import { motionTransitions } from '../lib/motion-tokens.js'
import { cn } from '../lib/utils.js'
import { ChartLegend } from './ChartLegend.js'
import { METER_COLOUR } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'

type Moment = number | string | Date

export interface LineSeries {
  key: string
  label: string
  /** A colour of its own; the design's otherwise (one series in the series colour, four compared in theirs). */
  color?: string
  /** Drawn dashed: a benchmark, a forecast. */
  dashed?: boolean
}

/** A moment (`t`: milliseconds, a `Date` or an ISO string) and each series' value then; `null` is a gap. */
export type LinePoint = { t: Moment } & Record<string, Moment | number | null>

export interface LineReference {
  value: number
  label?: string
  /** A limit's tone: `negative` for one not to cross, `warning` for one to watch. */
  tone?: MeterTone
}

export interface LineMarker {
  t: Moment
  label: string
}

export interface LineChartProps {
  data: LinePoint[]
  series: LineSeries[]
  /** An area under the line, for a single series. */
  area?: boolean
  /** Horizontal lines: a limit, a target. */
  references?: LineReference[]
  /** Moments marked across the chart: a restart, a release. */
  markers?: LineMarker[]
  /** Zero kept on the axis (a balance, a result), or the axis fitted to the values (a price, a delay). */
  zero?: boolean
  height?: number
  /** The time zone the times are read in. */
  timeZone?: string
  formatValue?: (value: number) => string
  formatTick?: (value: number) => string
  /** The moment at the top of the tooltip. */
  formatTime?: (t: number) => string
  /** More to say of a moment, under its series' values in the tooltip and in the table: "That day +€12.40". */
  details?: (point: LinePoint, index: number) => ChartDetail[]
  /**
   * A missing value is passed over and the line drawn through it: series measured on days of their own (runs
   * compared over the days of each). A gap in the line otherwise.
   */
  connectGaps?: boolean
  showLegend?: boolean
  /** Lines drawn in when they first show (not where motion is reduced). */
  animated?: boolean
  ariaLabel?: string
  className?: string
}

const toTime = (t: Moment): number => (typeof t === 'number' ? t : new Date(t).getTime())

const valueOf = (point: LinePoint, key: string): number | null => {
  const value = point[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/** The line's points, split where a value is missing: a gap is not a line through nothing. */
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

/** The index of the point nearest a moment, in data sorted by time. */
function nearest(times: number[], t: number): number {
  let low = 0
  let high = times.length - 1
  while (low < high) {
    const middle = (low + high) >> 1
    if (times[middle] < t) low = middle + 1
    else high = middle
  }
  return low > 0 && t - times[low - 1] < times[low] - t ? low - 1 : low
}

/**
 * Values over time, up to four series compared, in the design's colours: a balance, runs side by side, a
 * delay against its limit. Its points are read by pointer or keyboard, and given to screen readers as a
 * table. For a value as it arrives, `LiveLineChart`; for categories, `BarChart`.
 */
export function LineChart({
  data,
  series,
  area = false,
  references = [],
  markers = [],
  zero = false,
  height = 240,
  timeZone = 'UTC',
  formatValue = defaultFormat,
  formatTick = defaultTick,
  formatTime,
  details,
  connectGaps = false,
  showLegend = true,
  animated = true,
  ariaLabel,
  className,
}: LineChartProps) {
  const reduce = useReducedMotionConfig()
  const draw = animated && !reduce
  const gradient = useId()
  const [rootRef, width] = useElementWidth<HTMLDivElement>(640)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState<string[]>([])
  const [active, setActive] = useState<number | null>(null)
  useDismissOutside(
    wrapRef,
    active !== null,
    useCallback(() => setActive(null), []),
  )

  const colours = seriesColours(series.map((each) => each.color))
  const visible = series.map((each, index) => ({ ...each, color: colours[index] })).filter((each) => !hidden.includes(each.key))
  const times = data.map((point) => toTime(point.t))
  const n = data.length

  if (n === 0) return <p className="py-10 text-center text-[13px] text-muted-foreground">No data</p>

  const values = visible.flatMap((each) => data.map((point) => valueOf(point, each.key))).filter((value): value is number => value !== null)
  const limits = references.map((reference) => reference.value)
  const domain = niceDomain(Math.min(...values, ...limits), Math.max(...values, ...limits), 4, zero)
  const tickText = domain.ticks.map(formatTick)

  const M = { top: 14, right: 12, bottom: 24, left: Math.ceil(Math.max(...tickText.map((text) => text.length)) * 6.4) + 12 }
  const iw = Math.max(10, width - M.left - M.right)
  const ih = height - M.top - M.bottom
  const tMin = times[0]
  const tMax = times[n - 1]
  const x = (t: number) => M.left + (tMax === tMin ? iw / 2 : ((t - tMin) / (tMax - tMin)) * iw)
  const y = (value: number) => M.top + ((domain.max - value) / (domain.max - domain.min)) * ih
  const base = y(domain.min <= 0 && domain.max >= 0 ? 0 : domain.min)
  const axis = timeTicks(tMin, tMax, Math.max(2, Math.floor(iw / 90)), timeZone)
  const daily = axis.unit === 'day' || axis.unit === 'month'
  // A moment as the design writes it elsewhere (formatDay, formatDateTime): "07 Oct 2026, 09:30".
  const timeText =
    formatTime ??
    ((t: number) =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(daily ? {} : { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
      }).format(new Date(t)))

  const lines = visible.map((each) => {
    const points = data.map((point, index) => {
      const value = valueOf(point, each.key)
      return value === null ? null : ([x(times[index]), y(value)] as const)
    })
    // Drawn through a missing value, or split there.
    const parts = segments(connectGaps ? points.filter((point) => point !== null) : points)
    return { ...each, parts }
  })
  const detailsOf = (index: number) => details?.(data[index], index) ?? []

  const pick = (event: PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const t = tMin + ((event.clientX - box.left) / Math.max(1, box.width)) * (tMax - tMin)
    setActive(nearest(times, t))
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
  const toggle = (index: number) => {
    const key = series[index].key
    setHidden((now) => (now.includes(key) ? now.filter((each) => each !== key) : visible.length > 1 ? [...now, key] : now))
  }

  const activeX = active === null ? 0 : x(times[active])
  const activeTop =
    active === null
      ? 0
      : Math.min(...visible.map((each) => valueOf(data[active], each.key)).filter((value): value is number => value !== null).map(y), base)

  return (
    <div ref={rootRef} className={cn('w-full', className)}>
      <div ref={wrapRef} className="relative" style={{ height }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel ?? `Line chart of ${series.map((each) => each.label).join(', ')}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="block touch-pan-y overflow-visible rounded-lg"
        >
          {area && lines.length === 1 && (
            <defs>
              <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={lines[0].color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={lines[0].color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          {domain.ticks.map((tick, index) => (
            <g key={tick}>
              <line x1={M.left} x2={width - M.right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? AXIS_COLOUR : GRID_COLOUR} />
              <text x={M.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[11px] tabular-nums">
                {tickText[index]}
              </text>
            </g>
          ))}

          {axis.ticks.map((tick) => (
            <text key={tick} x={x(tick)} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-[11px] tabular-nums">
              {formatTimeTick(tick, axis.unit, timeZone)}
            </text>
          ))}

          {markers.map((marker) => {
            const at = x(toTime(marker.t))
            return (
              <g key={`${marker.label}-${toTime(marker.t)}`}>
                <line x1={at} x2={at} y1={M.top} y2={M.top + ih} stroke={AXIS_COLOUR} strokeDasharray="3 3" />
                <text x={at + 4} y={M.top + 2} dominantBaseline="hanging" className="fill-muted-foreground text-[10px]">
                  {marker.label}
                </text>
              </g>
            )
          })}

          {lines.map((line) =>
            line.parts.map((part, index) => {
              const d = monotonePath(part)
              const fill =
                area && lines.length === 1
                  ? `${d}L${part[part.length - 1][0].toFixed(2)} ${base.toFixed(2)}L${part[0][0].toFixed(2)} ${base.toFixed(2)}Z`
                  : null
              return (
                <g key={`${line.key}-${index}`}>
                  {fill && (
                    <motion.path
                      d={fill}
                      fill={`url(#${gradient})`}
                      initial={draw ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      transition={motionTransitions.easeSoft}
                    />
                  )}
                  {part.length === 1 ? (
                    <circle cx={part[0][0]} cy={part[0][1]} r={2} fill={line.color} />
                  ) : (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={line.dashed ? '5 4' : undefined}
                      // A dashed line fades in: drawing it in would undo its dashes.
                      initial={draw ? (line.dashed ? { opacity: 0 } : { pathLength: 0 }) : false}
                      animate={line.dashed ? { opacity: 1 } : { pathLength: 1 }}
                      transition={motionTransitions.easeSoft}
                    />
                  )}
                </g>
              )
            }),
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
                <text x={width - M.right} y={y(reference.value) - 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                  {reference.label}
                </text>
              )}
            </g>
          ))}

          {active !== null && (
            <g>
              <line x1={activeX} x2={activeX} y1={M.top} y2={M.top + ih} stroke={AXIS_COLOUR} />
              {visible.map((each) => {
                const value = valueOf(data[active], each.key)
                return value === null ? null : (
                  <circle key={each.key} cx={activeX} cy={y(value)} r={3.5} fill={each.color} className="stroke-surface" strokeWidth={1.5} />
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
              <p className="mb-1.5 font-medium text-foreground">{timeText(times[active])}</p>
              <ul className="space-y-1">
                {visible.map((each) => {
                  const value = valueOf(data[active], each.key)
                  return (
                    <li key={each.key} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: each.color }} />
                        {each.label}
                      </span>
                      <span className="tabular-nums text-foreground">{value === null ? '—' : formatValue(value)}</span>
                    </li>
                  )
                })}
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

      {showLegend && series.length > 1 && (
        <ChartLegend
          label="Series"
          className="mt-3"
          items={series.map((each, index) => ({
            label: each.label,
            color: colours[index],
            shape: each.dashed ? 'dashed' : 'line',
            shown: !hidden.includes(each.key),
          }))}
          onToggle={toggle}
        />
      )}

      <table className="sr-only">
        <caption>{ariaLabel ?? 'Chart data'}</caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            {series.map((each) => (
              <th key={each.key} scope="col">
                {each.label}
              </th>
            ))}
            {details && <th scope="col">Details</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((point, index) => (
            <tr key={times[index]}>
              <th scope="row">{timeText(times[index])}</th>
              {series.map((each) => {
                const value = valueOf(point, each.key)
                return <td key={each.key}>{value === null ? '—' : formatValue(value)}</td>
              })}
              {details && <td>{detailsText(detailsOf(index))}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
