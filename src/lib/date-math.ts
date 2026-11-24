// A range of time written as people mean it, which stays true as time goes by: "the last 15 minutes" is
// `{ from: 'now-15m', to: 'now' }`, "today" `{ from: 'now/d', to: 'now/d' }`. Each end is `now`, `now` moved
// (`now-15m`, `now+1h`) and rounded to a unit (`now-1d/d`: yesterday's start, or its end for the range's
// end), or a moment written out (an ISO string). Read and rounded in the browser's time zone; said in a locale's words
// (a catalogue's `timeRange`, English's by default).

import type { DateRange } from '../components/ui/calendar.js'
import { en } from '../locales/en.js'
import type { Messages } from '../locales/en.js'
import { DEFAULT_LOCALE } from './locale.js'
import type { HourCycle, WeekDay } from './locale.js'
import { kitFor } from './messages.js'

export interface TimeRange {
  from: string
  to: string
}

export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'

export const TIME_UNITS: TimeUnit[] = ['s', 'm', 'h', 'd', 'w', 'M', 'y']

function shift(date: Date, count: number, unit: TimeUnit): Date {
  const out = new Date(date)
  if (unit === 's') out.setSeconds(out.getSeconds() + count)
  else if (unit === 'm') out.setMinutes(out.getMinutes() + count)
  else if (unit === 'h') out.setHours(out.getHours() + count)
  else if (unit === 'd') out.setDate(out.getDate() + count)
  else if (unit === 'w') out.setDate(out.getDate() + count * 7)
  else if (unit === 'M') out.setMonth(out.getMonth() + count)
  else out.setFullYear(out.getFullYear() + count)
  return out
}

/** The start of the unit a moment is in, or its end (the last millisecond before the next). */
function round(date: Date, unit: TimeUnit, up: boolean, weekStartsOn: WeekDay): Date {
  const out = new Date(date)
  if (unit === 's') out.setMilliseconds(0)
  else if (unit === 'm') out.setSeconds(0, 0)
  else if (unit === 'h') out.setMinutes(0, 0, 0)
  else {
    out.setHours(0, 0, 0, 0)
    if (unit === 'w') out.setDate(out.getDate() - ((out.getDay() - weekStartsOn + 7) % 7))
    else if (unit === 'M') out.setDate(1)
    else if (unit === 'y') out.setMonth(0, 1)
  }
  return up ? new Date(shift(out, 1, unit).getTime() - 1) : out
}

export interface DateMathOptions {
  /** The time now, in milliseconds. */
  now?: number
  /** The end of a range: rounded up to the unit's end (`now/d` is the day's last moment). */
  roundUp?: boolean
  /** The day weeks start on (0 Sunday, 1 Monday … 6 Saturday), for a week rounded (`now/w`): Monday by default. */
  weekStartsOn?: WeekDay
}

const STEP = /^([+-])(\d+)([smhdwMy])|^\/([smhdwMy])/

/** The moment an end of a range stands for, or `null` where it is not one. */
export function parseDateMath(text: string, { now = Date.now(), roundUp = false, weekStartsOn = 1 }: DateMathOptions = {}): Date | null {
  const written = text.trim()
  if (!written.startsWith('now')) {
    const time = Date.parse(written)
    return Number.isNaN(time) ? null : new Date(time)
  }
  let date = new Date(now)
  let rest = written.slice(3)
  while (rest) {
    const step = STEP.exec(rest)
    if (!step) return null
    if (step[4]) date = round(date, step[4] as TimeUnit, roundUp, weekStartsOn)
    else date = shift(date, (step[1] === '-' ? -1 : 1) * Number(step[2]), step[3] as TimeUnit)
    rest = rest.slice(step[0].length)
  }
  return date
}

/** The two moments of a range, for a query (`rangeParams`), its end rounded up; `null` for what cannot be read. */
export function resolveTimeRange(range: TimeRange, options: Omit<DateMathOptions, 'roundUp'> = {}): DateRange {
  return {
    from: parseDateMath(range.from, options),
    to: parseDateMath(range.to, { ...options, roundUp: true }),
  }
}

export interface RelativeEnd {
  count: number
  unit: TimeUnit
  /** Before now (`ago`) or after it. */
  past: boolean
  /** The unit it is rounded to, if it is. */
  round?: TimeUnit
}

/** An end written as `now` moved by one step, and maybe rounded (`now-15m`, `now-1d/d`): its parts. */
export function relativeEnd(text: string): RelativeEnd | null {
  const match = /^now([+-])(\d+)([smhdwMy])(?:\/([smhdwMy]))?$/.exec(text.trim())
  if (!match) return null
  return { past: match[1] === '-', count: Number(match[2]), unit: match[3] as TimeUnit, round: (match[4] as TimeUnit) || undefined }
}

/** How a range or an end is said: in which words, and with which clock and week. */
export interface TimeRangeWordsOptions {
  /**
   * The words: a catalogue's (`fr.timeRange`, an application's), or a provider's as `useMessages().timeRange` gives them,
   * bound to its locale. English's by default.
   */
  words?: Messages['timeRange']
  /** The clock of a moment written out, 24 hours (`h23`) or 12 (`h12`): the locale's by default. */
  hourCycle?: HourCycle
  /** The day weeks start on, for an end written out as the moment it stands for (`now/w`): Monday by default. */
  weekStartsOn?: WeekDay
  /** The time now, in milliseconds, for an end written out as the moment it stands for. */
  now?: number
}

export interface TimeRangeEndOptions extends TimeRangeWordsOptions {
  /** The end of a range: a moment rounded up to its unit's end, as `resolveTimeRange` reads it (`now/d`: 23:59). */
  roundUp?: boolean
}

/**
 * An end of a range in words: "now", "15 minutes ago", "2 days ago, to the day", or else the moment it stands for,
 * "27 Oct 2026, 09:30" (`now/d` too: an end alone names no range); what cannot be read, as it is written.
 */
export function formatTimeRangeEnd(text: string, locale: string = DEFAULT_LOCALE, options: TimeRangeEndOptions = {}): string {
  const { words = en.timeRange, hourCycle, weekStartsOn, now, roundUp } = options
  // A word bound to a locale (`useMessages()`'s) takes its value alone, and leaves the kit given here.
  const kit = kitFor(locale)
  if (text.trim() === 'now') return words.now
  const relative = relativeEnd(text)
  if (relative) {
    const span = { count: relative.count, unit: relative.unit }
    const moved = relative.past ? words.ago(span, kit) : words.later(span, kit)
    return relative.round ? words.rounded({ moved, unit: relative.round }) : moved
  }
  const date = parseDateMath(text, { now, roundUp, weekStartsOn })
  if (!date) return text
  const moment: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle }
  return new Intl.DateTimeFormat(locale, moment).format(date)
}

type NamedRange =
  | 'today'
  | 'yesterday'
  | 'todaySoFar'
  | 'thisWeek'
  | 'thisWeekSoFar'
  | 'lastWeek'
  | 'thisMonth'
  | 'thisMonthSoFar'
  | 'lastMonth'
  | 'thisYear'
  | 'thisYearSoFar'

// The ranges with a name of their own, by their two ends.
const NAMED = new Map<string, NamedRange>([
  ['now/d now/d', 'today'],
  ['now-1d/d now-1d/d', 'yesterday'],
  ['now/d now', 'todaySoFar'],
  ['now/w now/w', 'thisWeek'],
  ['now/w now', 'thisWeekSoFar'],
  ['now-1w/w now-1w/w', 'lastWeek'],
  ['now/M now/M', 'thisMonth'],
  ['now/M now', 'thisMonthSoFar'],
  ['now-1M/M now-1M/M', 'lastMonth'],
  ['now/y now/y', 'thisYear'],
  ['now/y now', 'thisYearSoFar'],
])

/**
 * A range in words: "Last 15 minutes", "Today", or its two ends, "27 Oct 2026, 09:30 → now". In English, its moments as
 * Britain writes them, by default; in another language with its words (`formatTimeRange(range, 'fr-FR', { words:
 * fr.timeRange })`, or a component's `useMessages().timeRange` with `useLocale()`'s locale, clock and week).
 */
export function formatTimeRange(range: TimeRange, locale: string = DEFAULT_LOCALE, options: TimeRangeWordsOptions = {}): string {
  const { words = en.timeRange } = options
  const kit = kitFor(locale)
  const from = range.from.trim()
  const to = range.to.trim()
  const named = NAMED.get(`${from} ${to}`)
  if (named) return words[named]
  if (to === 'now') {
    const relative = relativeEnd(from)
    if (relative?.past && !relative.round) return words.lastSpan({ count: relative.count, unit: relative.unit }, kit)
  }
  if (from === 'now') {
    const relative = relativeEnd(to)
    if (relative && !relative.past && !relative.round) return words.nextSpan({ count: relative.count, unit: relative.unit }, kit)
  }
  return words.ends({
    from: formatTimeRangeEnd(range.from, locale, { ...options, roundUp: false }),
    to: formatTimeRangeEnd(range.to, locale, { ...options, roundUp: true }),
  })
}
