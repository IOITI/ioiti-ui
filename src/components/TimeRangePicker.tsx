import { CalendarClock, ChevronDown, Pause, Play, RefreshCw } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { formatTimeRange, parseDateMath, relativeEnd, TIME_UNITS, unitName } from '../lib/date-math.js'
import type { TimeRange, TimeUnit } from '../lib/date-math.js'
import { cn } from '../lib/utils.js'
import { NumberInput } from './NumberInput.js'
import { Popover } from './Popover.js'
import { SegmentedControl } from './SegmentedControl.js'
import { Button } from './ui/button.js'
import { Calendar } from './ui/calendar.js'
import { DrawCheckbox } from './ui/draw-checkbox.js'
import { Select } from './ui/form.js'

export interface CommonRange {
  label: string
  range: TimeRange
}

const COMMONLY_USED: CommonRange[] = [
  { label: 'Today', range: { from: 'now/d', to: 'now/d' } },
  { label: 'This week', range: { from: 'now/w', to: 'now/w' } },
  { label: 'Last 15 minutes', range: { from: 'now-15m', to: 'now' } },
  { label: 'Last 30 minutes', range: { from: 'now-30m', to: 'now' } },
  { label: 'Last 1 hour', range: { from: 'now-1h', to: 'now' } },
  { label: 'Last 24 hours', range: { from: 'now-24h', to: 'now' } },
  { label: 'Last 7 days', range: { from: 'now-7d', to: 'now' } },
  { label: 'Last 30 days', range: { from: 'now-30d', to: 'now' } },
  { label: 'Last 90 days', range: { from: 'now-90d', to: 'now' } },
  { label: 'Last 1 year', range: { from: 'now-1y', to: 'now' } },
]

const UNIT_OPTIONS = TIME_UNITS.map((unit) => ({ value: unit, label: unitName(unit, 2) }))

const SECTION = 'mb-1.5 text-xs font-medium text-text-secondary'

/* ---------------------------------------------------------------------------------------------------- */
/*  Refreshing on a timer                                                                               */
/* ---------------------------------------------------------------------------------------------------- */

export interface RefreshSettings {
  /** Milliseconds between two refreshes. */
  interval: number
  paused: boolean
}

const REFRESH_UNITS: { value: 's' | 'm' | 'h'; label: string; ms: number }[] = [
  { value: 's', label: 'seconds', ms: 1000 },
  { value: 'm', label: 'minutes', ms: 60_000 },
  { value: 'h', label: 'hours', ms: 3_600_000 },
]

/** The interval in its largest whole unit: 90 s is 90 seconds, 120 s two minutes. */
function inUnits(interval: number): { count: number; unit: 's' | 'm' | 'h' } {
  const unit = [...REFRESH_UNITS].reverse().find((each) => interval >= each.ms && interval % each.ms === 0) ?? REFRESH_UNITS[0]
  return { count: Math.max(1, Math.round(interval / unit.ms)), unit: unit.value }
}

/** "Every 30 s", "Every 5 min", or "Off". */
function refreshInWords({ interval, paused }: RefreshSettings): string {
  if (paused || interval <= 0) return 'Off'
  const { count, unit } = inUnits(interval)
  return `Every ${count} ${unit === 's' ? 's' : unit === 'm' ? 'min' : 'h'}`
}

/** Calls `refresh` every interval while not paused, and not while the page's tab is hidden. */
function useRefreshTimer({ interval, paused }: RefreshSettings, refresh: () => void) {
  const latest = useRef(refresh)
  useEffect(() => {
    latest.current = refresh
  })
  useEffect(() => {
    if (paused || interval <= 0 || typeof document === 'undefined') return
    let timer: ReturnType<typeof setInterval> | undefined
    const stop = () => {
      clearInterval(timer)
      timer = undefined
    }
    const start = () => {
      stop()
      if (document.visibilityState !== 'hidden') timer = setInterval(() => latest.current(), interval)
    }
    start()
    document.addEventListener('visibilitychange', start)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', start)
    }
  }, [interval, paused])
}

function RefreshEvery({ settings, onChange }: { settings: RefreshSettings; onChange: (settings: RefreshSettings) => void }) {
  const { count, unit } = inUnits(settings.interval || 60_000)
  const ms = (each: 's' | 'm' | 'h') => REFRESH_UNITS.find((option) => option.value === each)?.ms ?? 1000
  const id = useId()
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className={SECTION}>
        Refresh every
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <NumberInput
            label="Refresh every"
            value={count}
            min={1}
            integer
            steppers={false}
            onChange={(typed) => typed !== null && onChange({ ...settings, interval: typed * ms(unit) })}
          />
        </div>
        <div className="w-28">
          <Select
            aria-label="Unit of the refresh"
            value={unit}
            options={REFRESH_UNITS.map(({ value, label }) => ({ value, label }))}
            onChange={(event) => onChange({ ...settings, interval: count * ms(event.target.value as 's' | 'm' | 'h') })}
          />
        </div>
        <Button
          size="sm"
          variant={settings.paused ? 'primary' : 'outline'}
          leftIcon={settings.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          onClick={() => onChange({ interval: settings.interval || count * ms(unit), paused: !settings.paused })}
        >
          {settings.paused ? 'Start' : 'Stop'}
        </Button>
      </div>
    </section>
  )
}

interface AutoRefreshProps {
  /** How often, and whether it is stopped. */
  value: RefreshSettings
  onChange: (settings: RefreshSettings) => void
  /** Called each time it is due. */
  onRefresh: () => void
  className?: string
}

/**
 * Refreshes what a page shows on a timer: a button saying how often ("Every 30 s", "Off") that opens
 * where it is set and stopped. It waits while the page's tab is hidden, and starts again when it is back.
 */
export function AutoRefresh({ value, onChange, onRefresh, className }: AutoRefreshProps) {
  useRefreshTimer(value, onRefresh)
  const on = !value.paused && value.interval > 0
  return (
    <Popover
      label="Refresh"
      align="end"
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={className}
          leftIcon={<RefreshCw className={cn('size-3.5', on && 'motion-safe:animate-spin [animation-duration:3s]')} />}
        >
          {refreshInWords(value)}
        </Button>
      }
    >
      <RefreshEvery settings={value} onChange={onChange} />
    </Popover>
  )
}

/* ---------------------------------------------------------------------------------------------------- */
/*  The time range                                                                                       */
/* ---------------------------------------------------------------------------------------------------- */

const pad = (number: number) => String(number).padStart(2, '0')
const localIso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`

/** An end of the range as it is shown on its button: "15 minutes ago", "now", "27 Oct 2026, 09:30". */
function endInWords(text: string, locale: string): string {
  const words = formatTimeRange({ from: text, to: text }, locale)
  return words.includes(' → ') ? words.split(' → ')[0] : text
}

function QuickSelect({
  apply,
  commonlyUsed,
  recentlyUsed,
  refresh,
  onRefreshChange,
}: {
  apply: (range: TimeRange) => void
  commonlyUsed: CommonRange[]
  recentlyUsed: TimeRange[]
  refresh?: RefreshSettings
  onRefreshChange?: (settings: RefreshSettings) => void
}) {
  const [past, setPast] = useState(true)
  const [count, setCount] = useState<number | null>(15)
  const [unit, setUnit] = useState<TimeUnit>('m')
  const quickId = useId()
  const commonId = useId()
  const recentId = useId()
  const span = `${count ?? 1}${unit}`
  return (
    <div className="flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-4">
      <section aria-labelledby={quickId}>
        <h3 id={quickId} className={SECTION}>
          Quick select
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Select
              aria-label="Before or after now"
              value={past ? 'last' : 'next'}
              options={[
                { value: 'last', label: 'Last' },
                { value: 'next', label: 'Next' },
              ]}
              onChange={(event) => setPast(event.target.value === 'last')}
            />
          </div>
          <div className="w-16">
            <NumberInput label="How many" value={count} onChange={setCount} min={1} integer steppers={false} />
          </div>
          <div className="w-28">
            <Select aria-label="Unit" value={unit} options={UNIT_OPTIONS} onChange={(event) => setUnit(event.target.value as TimeUnit)} />
          </div>
          <Button size="sm" onClick={() => apply(past ? { from: `now-${span}`, to: 'now' } : { from: 'now', to: `now+${span}` })}>
            Apply
          </Button>
        </div>
      </section>
      <section aria-labelledby={commonId}>
        <h3 id={commonId} className={SECTION}>
          Commonly used
        </h3>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {commonlyUsed.map((common) => (
            <li key={common.label}>
              <button
                type="button"
                onClick={() => apply(common.range)}
                className="w-full rounded-md px-1.5 py-1 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover accent:text-brand-text"
              >
                {common.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
      {recentlyUsed.length > 0 && (
        <section aria-labelledby={recentId}>
          <h3 id={recentId} className={SECTION}>
            Recently used
          </h3>
          <ul className="flex flex-col gap-0.5">
            {recentlyUsed.map((range) => (
              <li key={`${range.from} ${range.to}`}>
                <button
                  type="button"
                  onClick={() => apply(range)}
                  className="w-full rounded-md px-1.5 py-1 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
                >
                  {formatTimeRange(range)}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {refresh && onRefreshChange && <RefreshEvery settings={refresh} onChange={onRefreshChange} />}
    </div>
  )
}

type EndMode = 'absolute' | 'relative' | 'now'

/** One end of the range: a moment on the calendar, a time from now, or now. */
function EndEditor({ which, value, onChange, locale, weekStartsOn }: { which: 'start' | 'end'; value: string; onChange: (text: string) => void; locale: string; weekStartsOn: 0 | 1 }) {
  const relative = relativeEnd(value)
  const [mode, setMode] = useState<EndMode>(value.trim() === 'now' ? 'now' : relative ? 'relative' : 'absolute')
  const panel = useId()
  // Now, as it was when the panel opened: what the end moves from.
  const [opened] = useState(() => Date.now())
  const date = parseDateMath(value, { now: opened, roundUp: which === 'end' }) ?? new Date(opened)
  const [count, setCount] = useState<number | null>(relative?.count ?? 15)
  const [unit, setUnit] = useState<TimeUnit>(relative?.unit ?? 'm')
  const [past, setPast] = useState(relative?.past ?? true)
  const [rounded, setRounded] = useState(relative?.round !== undefined)
  const relativeText = (next: Partial<{ count: number | null; unit: TimeUnit; past: boolean; rounded: boolean }>) => {
    const c = next.count === undefined ? count : next.count
    const u = next.unit ?? unit
    const p = next.past ?? past
    const r = next.rounded ?? rounded
    return `now${p ? '-' : '+'}${c ?? 1}${u}${r ? `/${u}` : ''}`
  }
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  return (
    <div className="flex w-[19rem] max-w-[calc(100vw-2rem)] flex-col gap-3">
      <SegmentedControl
        role="tablist"
        label={which === 'start' ? 'The start' : 'The end'}
        size="sm"
        fullWidth
        value={mode}
        onChange={(next) => {
          setMode(next)
          if (next === 'now') onChange('now')
          else if (next === 'relative') onChange(relativeText({}))
          else onChange(localIso(date))
        }}
        options={[
          { value: 'absolute', label: 'Absolute', panelId: `${panel}-absolute` },
          { value: 'relative', label: 'Relative', panelId: `${panel}-relative` },
          { value: 'now', label: 'Now', panelId: `${panel}-now` },
        ]}
      />
      {mode === 'absolute' && (
        <div id={`${panel}-absolute`} role="tabpanel" className="flex flex-col gap-2">
          <Calendar
            mode="single"
            value={date}
            locale={locale}
            weekStartsOn={weekStartsOn}
            onChange={(day) => {
              if (!day) return
              const next = new Date(day)
              next.setHours(date.getHours(), date.getMinutes(), 0, 0)
              onChange(localIso(next))
            }}
          />
          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary">
            Time
            <input
              type="time"
              value={time}
              onChange={(event) => {
                const [hours, minutes] = event.target.value.split(':').map(Number)
                if (Number.isNaN(hours) || Number.isNaN(minutes)) return
                const next = new Date(date)
                next.setHours(hours, minutes, 0, 0)
                onChange(localIso(next))
              }}
              // Its focus as the form's Input shows it: a field that takes text has no ring.
              className="h-8 rounded-md border border-border bg-surface px-2 text-xs tabular-nums text-text-primary focus:border-neutral-500 dark:focus:border-[#4A4A4A] accent:focus:border-brand"
            />
          </label>
        </div>
      )}
      {mode === 'relative' && (
        <div id={`${panel}-relative`} role="tabpanel" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-16">
              <NumberInput
                label="How many"
                value={count}
                min={0}
                integer
                steppers={false}
                onChange={(typed) => {
                  setCount(typed)
                  if (typed !== null) onChange(relativeText({ count: typed }))
                }}
              />
            </div>
            <div className="w-28">
              <Select
                aria-label="Unit"
                value={unit}
                options={UNIT_OPTIONS}
                onChange={(event) => {
                  const next = event.target.value as TimeUnit
                  setUnit(next)
                  onChange(relativeText({ unit: next }))
                }}
              />
            </div>
            <div className="w-28">
              <Select
                aria-label="Before or after now"
                value={past ? 'ago' : 'later'}
                options={[
                  { value: 'ago', label: 'ago' },
                  { value: 'later', label: 'from now' },
                ]}
                onChange={(event) => {
                  const next = event.target.value === 'ago'
                  setPast(next)
                  onChange(relativeText({ past: next }))
                }}
              />
            </div>
          </div>
          <DrawCheckbox
            label={`Round to the ${unitName(unit, 1)}`}
            checked={rounded}
            onChange={(event) => {
              const next = event.target.checked
              setRounded(next)
              onChange(relativeText({ rounded: next }))
            }}
          />
        </div>
      )}
      {mode === 'now' && (
        <div id={`${panel}-now`} role="tabpanel" className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>Now is the moment the range is read: each refresh moves it.</p>
          <Button size="sm" variant="outline" onClick={() => onChange('now')}>
            Set the {which} to now
          </Button>
        </div>
      )}
    </div>
  )
}

interface TimeRangePickerProps {
  /** The range applied: each end `now`, `now` moved and rounded (`now-15m`, `now/d`), or an ISO moment. */
  value?: TimeRange
  defaultValue?: TimeRange
  /** A new range applied (quick select, a range commonly used, or Update). */
  onChange?: (range: TimeRange) => void
  /** Asked for fresh data: on Refresh, on each new range, and on the timer where there is one. */
  onRefresh?: (range: TimeRange) => void
  /** Data is on its way: Refresh shows it. */
  isLoading?: boolean
  /** The ranges offered at once, in place of the usual ones. */
  commonlyUsed?: CommonRange[]
  /** Refreshing on a timer: shown in the quick select when given with `onRefreshChange`. */
  refresh?: RefreshSettings
  onRefreshChange?: (settings: RefreshSettings) => void
  locale?: string
  weekStartsOn?: 0 | 1
  className?: string
}

/**
 * A range of time, said as people say it ("Last 15 minutes", "Today") and kept true as time goes by:
 * a range chosen in two clicks (quick select, the ranges commonly used, those recently used), or its two
 * ends set one by one (a moment on the calendar, a time from now, now) and applied with Update; refreshed
 * by a press, or on a timer. As Elastic UI's super date picker does.
 */
export function TimeRangePicker({
  value,
  defaultValue = { from: 'now-15m', to: 'now' },
  onChange,
  onRefresh,
  isLoading = false,
  commonlyUsed = COMMONLY_USED,
  refresh,
  onRefreshChange,
  locale = 'en-GB',
  weekStartsOn = 1,
  className,
}: TimeRangePickerProps) {
  const [applied, setApplied] = useControllableState(value, defaultValue, onChange)
  const [draft, setDraft] = useState(applied)
  const [seen, setSeen] = useState(applied)
  if (applied.from !== seen.from || applied.to !== seen.to) {
    setSeen(applied)
    setDraft(applied)
  }
  const [recent, setRecent] = useState<TimeRange[]>([])
  const [dates, setDates] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)

  useRefreshTimer(refresh ?? { interval: 0, paused: true }, () => onRefresh?.(applied))

  const changed = draft.from !== applied.from || draft.to !== applied.to
  const start = parseDateMath(draft.from)
  const end = parseDateMath(draft.to, { roundUp: true })
  const invalid = !start || !end || start.getTime() > end.getTime()

  const apply = (range: TimeRange) => {
    setApplied(range)
    setDraft(range)
    setSeen(range)
    setRecent((now) => [range, ...now.filter((each) => each.from !== range.from || each.to !== range.to)].slice(0, 5))
    setQuickOpen(false)
    setDates(false)
    onRefresh?.(range)
  }

  const endButton = (which: 'start' | 'end'): ReactNode => {
    const text = which === 'start' ? draft.from : draft.to
    const wrong = which === 'start' ? !start || invalid : !end || invalid
    return (
      <Popover
        label={which === 'start' ? 'The start of the range' : 'The end of the range'}
        trigger={
          <button
            type="button"
            className={cn(
              'h-8 min-w-0 truncate rounded-md px-2 text-xs tabular-nums transition-colors hover:bg-surface-hover',
              wrong ? 'text-negative' : 'text-text-primary',
            )}
          >
            {endInWords(text, locale)}
          </button>
        }
      >
        <EndEditor
          which={which}
          value={text}
          locale={locale}
          weekStartsOn={weekStartsOn}
          onChange={(next) => setDraft((now) => (which === 'start' ? { ...now, from: next } : { ...now, to: next }))}
        />
      </Popover>
    )
  }

  return (
    <div className={cn('flex w-full min-w-0 items-center gap-2', className)}>
      <div className="flex h-10 min-w-0 flex-1 items-center gap-1 rounded-lg border border-neutral-300 bg-white px-1 dark:border-[#1F1F1F] dark:bg-[#141414]">
        <Popover
          label="Quick select"
          open={quickOpen}
          onOpenChange={setQuickOpen}
          trigger={
            <button
              type="button"
              aria-label="Quick select"
              className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary [&>svg]:size-4"
            >
              <CalendarClock aria-hidden />
              <ChevronDown aria-hidden className="!size-3" />
            </button>
          }
        >
          <QuickSelect apply={apply} commonlyUsed={commonlyUsed} recentlyUsed={recent} refresh={refresh} onRefreshChange={onRefreshChange} />
        </Popover>
        <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
        {dates || changed ? (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {endButton('start')}
            <span aria-hidden className="text-xs text-text-muted">
              →
            </span>
            {endButton('end')}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDates(true)}
            className="h-8 min-w-0 flex-1 truncate rounded-md px-2 text-left text-xs text-text-primary transition-colors hover:bg-surface-hover"
          >
            {formatTimeRange(applied, locale)}
            <span className="sr-only">: show its start and its end</span>
          </button>
        )}
      </div>
      {changed ? (
        <Button size="md" disabled={invalid} onClick={() => apply(draft)} leftIcon={<RefreshCw className="size-4" />}>
          Update
        </Button>
      ) : (
        <Button
          size="md"
          variant="outline"
          isLoading={isLoading}
          loadingText="Refreshing"
          onClick={() => onRefresh?.(applied)}
          leftIcon={<RefreshCw className="size-4" />}
        >
          Refresh
        </Button>
      )}
    </div>
  )
}
