import { useId } from 'react'
import type { ChangeEvent, ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { formatNumber } from '../lib/format.js'
import { cn } from '../lib/utils.js'
import { METER_FILL } from './meter-tones.js'
import type { MeterTone } from './meter-tones.js'
import { NumberInput } from './NumberInput.js'

export interface SliderTick {
  value: number
  label?: ReactNode
}

export interface SliderLevel {
  from: number
  to: number
  tone: MeterTone
}

interface SliderBase {
  /** What it sets, shown above it: "Risk per trade". */
  label: ReactNode
  /** Its name for a screen reader, where the label is not text. */
  ariaLabel?: string
  min?: number
  max?: number
  step?: number
  /** The value in words: "2.5%", "45 min". */
  format?: (value: number) => string
  /** Marks under the track: at every step (`true`), at the values given, or with their labels. */
  ticks?: boolean | number[] | SliderTick[]
  /** Bands of the track in a tone: where a value is safe, to watch, too far. */
  levels?: SliderLevel[]
  disabled?: boolean
  className?: string
}

interface SliderProps extends SliderBase {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  /** A field beside it, to type the value. */
  showInput?: boolean
}

interface RangeSliderProps extends SliderBase {
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
}

// The browser's own range input, its track hidden (the slider draws its own under it), its thumb drawn
// here in both engines: a disc in the page's colour, ringed in the text's (the accent's, where the look has one).
const THUMB =
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm active:[&::-webkit-slider-thumb]:cursor-grabbing accent:[&::-webkit-slider-thumb]:border-brand ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:bg-background accent:[&::-moz-range-thumb]:border-brand'
const RANGE = cn(
  'absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed',
  '[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent',
  THUMB,
)

function tickList(ticks: SliderBase['ticks'], min: number, max: number, step: number): SliderTick[] {
  if (!ticks) return []
  if (ticks === true) {
    const count = Math.floor((max - min) / step)
    return count > 40 ? [] : Array.from({ length: count + 1 }, (_, index) => ({ value: min + index * step }))
  }
  return ticks.map((tick) => (typeof tick === 'number' ? { value: tick } : tick))
}

/** The track: its bands, its fill from `from` to `to` (in percent), its ticks under it. */
function Track({
  from,
  to,
  levels,
  ticks,
  min,
  max,
  children,
}: {
  from: number
  to: number
  levels: SliderLevel[]
  ticks: SliderTick[]
  min: number
  max: number
  children: ReactNode
}) {
  const at = (value: number) => ((value - min) / (max - min || 1)) * 100
  const labelled = ticks.some((tick) => tick.label !== undefined)
  return (
    <div className={cn('relative', labelled ? 'pb-5' : ticks.length ? 'pb-2' : '')}>
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/10">
          {levels.map((level, index) => (
            <span
              key={index}
              aria-hidden
              className={cn('absolute inset-y-0 opacity-30', METER_FILL[level.tone])}
              style={{ left: `${at(level.from)}%`, width: `${at(level.to) - at(level.from)}%` }}
            />
          ))}
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-full bg-foreground/70 accent:bg-brand"
            style={{ left: `${from}%`, width: `${Math.max(to - from, 0)}%` }}
          />
        </div>
        {children}
      </div>
      {ticks.map((tick) => (
        <span key={tick.value} aria-hidden className="absolute top-5 -translate-x-1/2 text-center" style={{ left: `${at(tick.value)}%` }}>
          <span className="mx-auto block h-1 w-px bg-border-hover" />
          {tick.label !== undefined && <span className="mt-0.5 block whitespace-nowrap text-[11px] text-muted-foreground">{tick.label}</span>}
        </span>
      ))}
    </div>
  )
}

function Header({ id, label, said }: { id: string; label: ReactNode; said: string }) {
  return (
    <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
      <span id={id} className="text-text-secondary">
        {label}
      </span>
      <span aria-hidden className="tabular-nums text-text-primary">
        {said}
      </span>
    </div>
  )
}

/**
 * A value chosen along a scale: a risk, a share, a delay. The browser's own range input, its keyboard and
 * its screen reader's support with it (the arrows, Page Up and Down, Home and End), its value in words.
 * Its scale may show ticks and bands in a tone; a field beside it types the value.
 */
export function Slider({
  label,
  ariaLabel,
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (number) => formatNumber(number, step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0),
  ticks,
  levels = [],
  showInput = false,
  disabled = false,
  className,
}: SliderProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onChange)
  const id = useId()
  const at = ((current - min) / (max - min || 1)) * 100
  return (
    <div className={cn('flex w-full items-end gap-4', className)}>
      <div className="min-w-0 flex-1">
        <Header id={id} label={label} said={format(current)} />
        <Track from={0} to={at} levels={levels} ticks={tickList(ticks, min, max, step)} min={min} max={max}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={disabled}
            aria-labelledby={ariaLabel ? undefined : id}
            aria-label={ariaLabel}
            aria-valuetext={format(current)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrent(Number(event.target.value))}
            className={RANGE}
          />
        </Track>
      </div>
      {showInput && (
        <div className="w-28 shrink-0">
          <NumberInput
            label={typeof label === 'string' ? label : ariaLabel}
            value={current}
            onChange={(typed) => typed !== null && setCurrent(Math.min(max, Math.max(min, typed)))}
            min={min}
            max={max}
            step={step}
            steppers={false}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}

/** Two values along a scale, a range between them: a price from and to, the hours a task may run. */
export function RangeSlider({
  label,
  ariaLabel,
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (number) => formatNumber(number, step < 1 ? String(step).split('.')[1]?.length ?? 0 : 0),
  ticks,
  levels = [],
  disabled = false,
  className,
}: RangeSliderProps) {
  const [current, setCurrent] = useControllableState<[number, number]>(value, defaultValue ?? [min, max], onChange)
  const id = useId()
  const [low, high] = current
  const at = (number: number) => ((number - min) / (max - min || 1)) * 100
  const name = ariaLabel ?? (typeof label === 'string' ? label : 'Range')
  return (
    <div className={cn('w-full', className)}>
      <Header id={id} label={label} said={`${format(low)} – ${format(high)}`} />
      <Track from={at(low)} to={at(high)} levels={levels} ticks={tickList(ticks, min, max, step)} min={min} max={max}>
        {/* Two inputs over each other, each taking the pointer on its thumb only. */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          disabled={disabled}
          aria-label={`${name}, from`}
          aria-valuetext={format(low)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrent([Math.min(Number(event.target.value), high), high])}
          // At the top of the scale, the lower thumb is the one that can still move: it is above the other.
          className={cn(RANGE, 'pointer-events-none', low >= max - step ? 'z-20' : 'z-10')}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          aria-label={`${name}, to`}
          aria-valuetext={format(high)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrent([low, Math.max(Number(event.target.value), low)])}
          className={cn(RANGE, 'pointer-events-none z-10')}
        />
      </Track>
    </div>
  )
}
