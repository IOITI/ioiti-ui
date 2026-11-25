import { CalendarClock, ChevronDown, Pause, Play, RefreshCw } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode, Ref } from 'react'

import { useControllableState } from '../lib/controllable.js'
import { dataAttributes } from '../lib/data-attributes.js'
import type { DataAttributes } from '../lib/data-attributes.js'
import { formatTimeRange, formatTimeRangeEnd, parseDateMath, relativeEnd, TIME_UNITS } from '../lib/date-math.js'
import type { TimeRange, TimeRangeWordsOptions, TimeUnit } from '../lib/date-math.js'
import { deprecated } from '../lib/deprecated.js'
import { fieldBorder, invalidOf } from '../lib/field-border.js'
import type { WeekDay } from '../lib/locale.js'
import { PRESSABLE } from '../lib/recipes.js'
import { cn } from '../lib/utils.js'
import { useLocale, useMessages } from './locale-context.js'
import type { BoundMessages } from './locale-context.js'
import { NumberInput } from './NumberInput.js'
import { Popover } from './Popover.js'
import { SegmentedControl } from './SegmentedControl.js'
import { Button } from './ui/button.js'
import { Calendar } from './ui/calendar.js'
import { DrawCheckbox } from './ui/draw-checkbox.js'
import { FieldContext, useFieldControl } from './field-context.js'
import { Select } from './ui/form.js'

export interface CommonRange {
  label: string
  range: TimeRange
}

// The ranges commonly used by default, each named as formatTimeRange names it ("Today", "Last 15 minutes"): the list and
// the button say a range in the same words.
const COMMON_RANGES: TimeRange[] = [
  { from: 'now/d', to: 'now/d' },
  { from: 'now/w', to: 'now/w' },
  { from: 'now-15m', to: 'now' },
  { from: 'now-30m', to: 'now' },
  { from: 'now-1h', to: 'now' },
  { from: 'now-24h', to: 'now' },
  { from: 'now-7d', to: 'now' },
  { from: 'now-30d', to: 'now' },
  { from: 'now-90d', to: 'now' },
  { from: 'now-1y', to: 'now' },
]

/** The words of the picker, in the provider's language. */
type Words = BoundMessages['timeRange']

/** A list of units, each named for the count beside it (`count ?? 1`, what is applied while the field is empty). */
function unitOptions<U extends TimeUnit>(words: Words, count: number | null, units: readonly U[]) {
  return units.map((unit) => ({ value: unit, label: words.unitOption({ count: count ?? 1, unit }) }))
}

const SECTION = 'mb-1.5 text-xs font-medium text-text-secondary'

/* ---------------------------------------------------------------------------------------------------- */
/*  Refreshing on a timer                                                                               */
/* ---------------------------------------------------------------------------------------------------- */

export interface RefreshSettings {
  /** Milliseconds between two refreshes. */
  interval: number
  paused: boolean
}

const REFRESH_UNITS: { value: 's' | 'm' | 'h'; ms: number }[] = [
  { value: 's', ms: 1000 },
  { value: 'm', ms: 60_000 },
  { value: 'h', ms: 3_600_000 },
]

/**
 * What a popover of the picker holds: its own fields, never the field of a Field or a FormItem the picker is in (its
 * id, what describes it): its Selects would take them, twice over.
 */
function OwnFields({ children }: { children: ReactNode }) {
  return <FieldContext.Provider value={null}>{children}</FieldContext.Provider>
}

/** The interval in its largest whole unit: 90 s is 90 seconds, 120 s two minutes. */
function inUnits(interval: number): { count: number; unit: 's' | 'm' | 'h' } {
  const unit = [...REFRESH_UNITS].reverse().find((each) => interval >= each.ms && interval % each.ms === 0) ?? REFRESH_UNITS[0]
  return { count: Math.max(1, Math.round(interval / unit.ms)), unit: unit.value }
}

/** "Every 30 s", "Every 5 min", or "Off", in the words given. */
function refreshInWords({ interval, paused }: RefreshSettings, words: Words): string {
  if (paused || interval <= 0) return words.refreshOff
  return words.refreshEvery(inUnits(interval))
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
  const words = useMessages().timeRange
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className={SECTION}>
        {words.refreshInterval}
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <NumberInput
            label={words.refreshInterval}
            value={count}
            min={1}
            integer
            steppers={false}
            onChange={(typed) => typed !== null && onChange({ ...settings, interval: typed * ms(unit) })}
          />
        </div>
        <div className="w-28">
          <Select
            aria-label={words.refreshUnit}
            value={unit}
            options={unitOptions(words, count, REFRESH_UNITS.map((each) => each.value))}
            onChange={(event) => onChange({ ...settings, interval: count * ms(event.target.value as 's' | 'm' | 'h') })}
          />
        </div>
        <Button
          size="sm"
          variant={settings.paused ? 'primary' : 'outline'}
          leftIcon={settings.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          onClick={() => onChange({ interval: settings.interval || count * ms(unit), paused: !settings.paused })}
        >
          {settings.paused ? words.startRefresh : words.stopRefresh}
        </Button>
      </div>
    </section>
  )
}

/** The props of `AutoRefresh`. */
export interface AutoRefreshProps {
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
  const words = useMessages().timeRange
  const on = !value.paused && value.interval > 0
  return (
    <Popover
      label={words.autoRefresh}
      align="end"
      trigger={
        <Button
          variant="outline"
          size="sm"
          className={className}
          leftIcon={<RefreshCw className={cn('size-3.5', on && 'motion-safe:animate-spin [animation-duration:3s]')} />}
        >
          {refreshInWords(value, words)}
        </Button>
      }
    >
      <OwnFields>
        <RefreshEvery settings={value} onChange={onChange} />
      </OwnFields>
    </Popover>
  )
}

/* ---------------------------------------------------------------------------------------------------- */
/*  The time range                                                                                       */
/* ---------------------------------------------------------------------------------------------------- */

const pad = (number: number) => String(number).padStart(2, '0')
const localIso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`

function QuickSelect({
  apply,
  commonlyUsed,
  recentlyUsed,
  nameOf,
  refresh,
  onRefreshChange,
}: {
  apply: (range: TimeRange) => void
  commonlyUsed: CommonRange[]
  recentlyUsed: TimeRange[]
  /** A range in the picker's words, its locale, its clock and its week. */
  nameOf: (range: TimeRange) => string
  refresh?: RefreshSettings
  onRefreshChange?: (settings: RefreshSettings) => void
}) {
  const [past, setPast] = useState(true)
  const [count, setCount] = useState<number | null>(15)
  const [unit, setUnit] = useState<TimeUnit>('m')
  const quickId = useId()
  const commonId = useId()
  const recentId = useId()
  const words = useMessages().timeRange
  const span = `${count ?? 1}${unit}`
  return (
    <div className="flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-4">
      <section aria-labelledby={quickId}>
        <h3 id={quickId} className={SECTION}>
          {words.quickSelect}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-24">
            <Select
              aria-label={words.beforeOrAfterNow}
              value={past ? 'last' : 'next'}
              options={[
                { value: 'last', label: words.lastOption },
                { value: 'next', label: words.nextOption },
              ]}
              onChange={(event) => setPast(event.target.value === 'last')}
            />
          </div>
          <div className="w-16">
            <NumberInput label={words.howMany} value={count} onChange={setCount} min={1} integer steppers={false} />
          </div>
          <div className="w-28">
            <Select
              aria-label={words.unit}
              value={unit}
              options={unitOptions(words, count, TIME_UNITS)}
              onChange={(event) => setUnit(event.target.value as TimeUnit)}
            />
          </div>
          <Button size="sm" onClick={() => apply(past ? { from: `now-${span}`, to: 'now' } : { from: 'now', to: `now+${span}` })}>
            {words.apply}
          </Button>
        </div>
      </section>
      <section aria-labelledby={commonId}>
        <h3 id={commonId} className={SECTION}>
          {words.commonlyUsed}
        </h3>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {commonlyUsed.map((common) => (
            <li key={common.label}>
              <button
                type="button"
                onClick={() => apply(common.range)}
                className="w-full cursor-pointer rounded-md px-1.5 py-1 text-left text-sm text-foreground transition-colors hover:bg-surface-hover accent:text-brand-text"
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
            {words.recentlyUsed}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {recentlyUsed.map((range) => (
              <li key={`${range.from} ${range.to}`}>
                <button
                  type="button"
                  onClick={() => apply(range)}
                  className="w-full cursor-pointer rounded-md px-1.5 py-1 text-left text-sm text-foreground transition-colors hover:bg-surface-hover"
                >
                  {nameOf(range)}
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
function EndEditor({
  which,
  value,
  onChange,
  locale,
  weekStartsOn,
}: {
  which: 'start' | 'end'
  value: string
  onChange: (text: string) => void
  locale: string
  weekStartsOn: WeekDay
}) {
  const words = useMessages().timeRange
  const relative = relativeEnd(value)
  const [mode, setMode] = useState<EndMode>(value.trim() === 'now' ? 'now' : relative ? 'relative' : 'absolute')
  const panel = useId()
  // Now, as it was when the panel opened: what the end moves from.
  const [opened] = useState(() => Date.now())
  const date = parseDateMath(value, { now: opened, roundUp: which === 'end', weekStartsOn }) ?? new Date(opened)
  const [count, setCount] = useState<number | null>(relative?.count ?? 15)
  const [unit, setUnit] = useState<TimeUnit>(relative?.unit ?? 'm')
  const [past, setPast] = useState(relative?.past ?? true)
  const [roundToUnit, setRoundToUnit] = useState(relative?.round !== undefined)
  const relativeText = (next: Partial<{ count: number | null; unit: TimeUnit; past: boolean; roundToUnit: boolean }>) => {
    const c = next.count === undefined ? count : next.count
    const u = next.unit ?? unit
    const p = next.past ?? past
    const r = next.roundToUnit ?? roundToUnit
    return `now${p ? '-' : '+'}${c ?? 1}${u}${r ? `/${u}` : ''}`
  }
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  // Each tab says which panel it shows (aria-controls), and each panel is named by its tab's words, which carry an id
  // (SegmentedControl gives its tabs none).
  const labelledBy = (each: EndMode) => `${panel}-${each}-tab`
  const tab = (each: EndMode, name: string) => ({
    value: each,
    label: <span id={labelledBy(each)}>{name}</span>,
    panelId: `${panel}-${each}`,
  })

  return (
    <div className="flex w-[19rem] max-w-[calc(100vw-2rem)] flex-col gap-3">
      <SegmentedControl
        role="tablist"
        label={which === 'start' ? words.startTabs : words.endTabs}
        size="sm"
        fullWidth
        value={mode}
        onChange={(next) => {
          setMode(next)
          if (next === 'now') onChange('now')
          else if (next === 'relative') onChange(relativeText({}))
          else onChange(localIso(date))
        }}
        options={[tab('absolute', words.absolute), tab('relative', words.relative), tab('now', words.nowTab)]}
      />
      {mode === 'absolute' && (
        <div id={`${panel}-absolute`} role="tabpanel" aria-labelledby={labelledBy('absolute')} className="flex flex-col gap-2">
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
            {words.time}
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
              className={cn('h-10 rounded-lg border bg-surface px-3.5 text-base sm:text-sm tabular-nums text-foreground transition-colors', fieldBorder(false))}
            />
          </label>
        </div>
      )}
      {mode === 'relative' && (
        <div id={`${panel}-relative`} role="tabpanel" aria-labelledby={labelledBy('relative')} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-16">
              <NumberInput
                label={words.howMany}
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
                aria-label={words.unit}
                value={unit}
                options={unitOptions(words, count, TIME_UNITS)}
                onChange={(event) => {
                  const next = event.target.value as TimeUnit
                  setUnit(next)
                  onChange(relativeText({ unit: next }))
                }}
              />
            </div>
            <div className="w-28">
              <Select
                aria-label={words.beforeOrAfterNow}
                value={past ? 'ago' : 'later'}
                options={[
                  { value: 'ago', label: words.agoOption },
                  { value: 'later', label: words.fromNowOption },
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
            label={words.roundTo(unit)}
            checked={roundToUnit}
            onChange={(event) => {
              const next = event.target.checked
              setRoundToUnit(next)
              onChange(relativeText({ roundToUnit: next }))
            }}
          />
        </div>
      )}
      {mode === 'now' && (
        <div id={`${panel}-now`} role="tabpanel" aria-labelledby={labelledBy('now')} className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>{words.nowExplained}</p>
          <Button size="sm" variant="outline" onClick={() => onChange('now')}>
            {which === 'start' ? words.setStartToNow : words.setEndToNow}
          </Button>
        </div>
      )}
    </div>
  )
}

export interface TimeRangePickerProps extends DataAttributes {
  /** The range applied: each end `now`, `now` moved and rounded (`now-15m`, `now/d`), or an ISO moment. */
  value?: TimeRange
  defaultValue?: TimeRange
  /** A new range applied (quick select, a range commonly used, or Update). */
  onChange?: (range: TimeRange) => void
  /** Asked for fresh data: on Refresh, on each new range, and on the timer where there is one. */
  onRefresh?: (range: TimeRange) => void
  /** Data is on its way: Refresh shows it. */
  loading?: boolean
  /** @deprecated Use `loading`. Removed in 1.0. */
  isLoading?: boolean
  /**
   * The ranges offered at once, in place of the usual ones: today, this week, the last 15 and 30 minutes, hour, 24 hours,
   * 7, 30 and 90 days, and year, each named as `formatTimeRange` names it, in the provider's words.
   */
  commonlyUsed?: CommonRange[]
  /** Refreshing on a timer: shown in the quick select when given with `onRefreshChange`. */
  refresh?: RefreshSettings
  onRefreshChange?: (settings: RefreshSettings) => void
  /** The locale its moments and its calendar are written in: the provider's by default (IoitiProvider's; en-GB outside one). */
  locale?: string
  /**
   * The day its weeks start on (0 Sunday, 1 Monday … 6 Saturday): its calendar's first column, and the start of a week a
   * range is rounded to (`now/w`). The provider's by default (its locale's: Monday in en-GB, Sunday in en-US).
   */
  weekStartsOn?: WeekDay
  className?: string
  /** The group's id (what holds its buttons), for a `<label htmlFor>`; in a FormItem, the item's. */
  id?: string
  /**
   * The name its range is sent under with a form: two values, its start then its end, as `value` writes them
   * (`now-15m`, `now`, an ISO moment), a hidden input each with this name.
   */
  name?: string
  /** The group's name: what the range is for ("Period of the logs"). */
  'aria-label'?: string
  /** The id of what names the group: a heading. A Field's label names it without it. */
  'aria-labelledby'?: string
  /** Read out with it: what a Field around it says under it (its description, its error). */
  'aria-describedby'?: string
  /** Marked invalid, as a Field with an error marks it: its frame in the negative colour. */
  'aria-invalid'?: boolean | 'true' | 'false'
  /** The group (its outermost element), which holds its buttons. */
  ref?: Ref<HTMLDivElement>
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
  loading: givenLoading,
  isLoading,
  commonlyUsed,
  refresh,
  onRefreshChange,
  locale,
  weekStartsOn,
  className,
  id,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ref,
  ...rest
}: TimeRangePickerProps) {
  // Its former name read as today's, said once in development.
  if (isLoading !== undefined) deprecated('is-loading', 'TimeRangePicker')
  const loading = givenLoading ?? isLoading ?? false
  // A group of buttons, named, described and marked by a Field or a FormItem around it too, its own props first: by
  // its label's words (aria-labelledby: a label names no group), the label pointing to it, so that it names no button.
  const groupId = useId()
  const control = useFieldControl({
    id,
    fallbackId: groupId,
    labelledBy,
    named: Boolean(ariaLabel),
    describedBy,
    invalid: invalidOf(undefined, ariaInvalid),
  })
  const grouped = Boolean(ariaLabel || control.labelledBy || control.describedBy || control.invalid)
  // The provider's locale, week, clock and words, where the props give none.
  const provider = useLocale()
  const words = useMessages().timeRange
  const tag = locale ?? provider.locale
  const firstDay = weekStartsOn ?? provider.weekStartsOn
  const say = useMemo<TimeRangeWordsOptions>(
    () => ({ words, hourCycle: provider.hourCycle, weekStartsOn: firstDay }),
    [words, provider.hourCycle, firstDay],
  )
  const offered = useMemo(
    () => commonlyUsed ?? COMMON_RANGES.map((range) => ({ label: formatTimeRange(range, tag, say), range })),
    [commonlyUsed, tag, say],
  )
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
  const start = parseDateMath(draft.from, { weekStartsOn: firstDay })
  const end = parseDateMath(draft.to, { roundUp: true, weekStartsOn: firstDay })
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
        label={which === 'start' ? words.startOfRange : words.endOfRange}
        trigger={
          <button
            type="button"
            className={cn(
              'h-8 min-w-0 cursor-pointer truncate rounded-lg px-2 text-sm tabular-nums transition-colors hover:bg-surface-hover',
              wrong ? 'text-negative' : 'text-foreground',
            )}
          >
            {formatTimeRangeEnd(text, tag, { ...say, roundUp: which === 'end' })}
          </button>
        }
      >
        <OwnFields>
          <EndEditor
            which={which}
            value={text}
            locale={tag}
            weekStartsOn={firstDay}
            onChange={(next) => setDraft((now) => (which === 'start' ? { ...now, from: next } : { ...now, to: next }))}
          />
        </OwnFields>
      </Popover>
    )
  }

  return (
    <div
      ref={ref}
      {...dataAttributes(rest)}
      id={control.id}
      role={grouped ? 'group' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={control.labelledBy}
      aria-describedby={control.describedBy}
      aria-invalid={control.invalid || undefined}
      className={cn('flex w-full min-w-0 items-center gap-2', className)}
    >
      {/* The range applied, sent with the form around it under its `name`: its start, then its end. */}
      {name && [applied.from, applied.to].map((end, index) => <input key={index} type="hidden" name={name} value={end} />)}
      <div
        className={cn(
          'flex h-10 min-w-0 flex-1 items-center gap-1 rounded-lg border bg-surface px-1',
          control.invalid ? fieldBorder(true, 'focus-within') : 'border-border',
        )}
      >
        <Popover
          label={words.quickSelect}
          open={quickOpen}
          onOpenChange={setQuickOpen}
          trigger={
            <button
              type="button"
              aria-label={words.quickSelect}
              className={cn(
                'inline-flex h-8 shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground [&>svg]:size-4',
                PRESSABLE,
              )}
            >
              <CalendarClock aria-hidden />
              <ChevronDown aria-hidden className="!size-3" />
            </button>
          }
        >
          <OwnFields>
            <QuickSelect
              apply={apply}
              commonlyUsed={offered}
              recentlyUsed={recent}
              nameOf={(range) => formatTimeRange(range, tag, say)}
              refresh={refresh}
              onRefreshChange={onRefreshChange}
            />
          </OwnFields>
        </Popover>
        <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
        {dates || changed ? (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {endButton('start')}
            <span aria-hidden className="text-xs text-muted-foreground">
              {words.arrow}
            </span>
            {endButton('end')}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDates(true)}
            className="h-8 min-w-0 flex-1 cursor-pointer truncate rounded-lg px-2 text-left text-sm text-foreground transition-colors hover:bg-surface-hover"
          >
            {formatTimeRange(applied, tag, say)}
            <span className="sr-only">{words.showEnds}</span>
          </button>
        )}
      </div>
      {changed ? (
        <Button size="md" disabled={invalid} onClick={() => apply(draft)} leftIcon={<RefreshCw className="size-4" />}>
          {words.update}
        </Button>
      ) : (
        <Button
          size="md"
          variant="outline"
          pending={loading}
          loadingText={words.refreshing}
          onClick={() => onRefresh?.(applied)}
          leftIcon={<RefreshCw className="size-4" />}
        >
          {words.refresh}
        </Button>
      )}
    </div>
  )
}
