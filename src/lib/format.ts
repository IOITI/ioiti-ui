// What the package writes of a number, an amount, a moment or a size, as a locale writes them: its separators, its
// sign's place, its months, its clock, and its words (the units, "ago") from its catalogue. `formattersFor(locale)`
// makes them for a locale; a component takes its provider's (`useFormat()`). The functions exported alone are English
// (en-GB), as they always were.
import { en } from '../locales/en.js'
import type { Messages } from '../locales/en.js'
import { DEFAULT_LOCALE, hourCycleOf } from './locale.js'
import type { HourCycle } from './locale.js'
import { bindMessages } from './messages.js'
import type { SignTone } from './tones.js'

const EMPTY = '—'
const MINUS = '−'

function isNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** A number written by Intl with a true minus (Intl writes a hyphen), where the locale puts its sign. */
function withTrueMinus(format: Intl.NumberFormat, value: number): string {
  return format
    .formatToParts(value)
    .map((part) => (part.type === 'minusSign' ? MINUS : part.value))
    .join('')
}

/** The formats of a locale: the same functions as the ones exported alone, in its ways and words. */
export interface Formatters {
  /** An amount of money, with an explicit sign when `withSign` (profit and loss); a minus where it is a loss. */
  formatMoney: (value: number | null | undefined, currency?: string | null, withSign?: boolean) => string
  /** Compact money for axis ticks: 1.2k, 3.4m. */
  formatMoneyCompact: (value: number) => string
  /** A percentage given in points (12.4 is "12.40%"), with an explicit sign when `withSign`. */
  formatPercent: (value: number | null | undefined, withSign?: boolean, digits?: number) => string
  /** A number with a fixed number of decimals; a true minus, none on a zero rounded from below. */
  formatNumber: (value: number | null | undefined, digits?: number) => string
  /**
   * A timestamp shown in the time zone given (the one the application's data is about, not the browser's). The year is
   * left out while it is this year's, and written otherwise: a history may go back further than twelve months.
   */
  formatDateTime: (value: string | null | undefined, timeZone: string, withSeconds?: boolean, now?: Date) => string
  /** A time of day to the second. */
  formatTime: (value: string | null | undefined, timeZone: string) => string
  /** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
  formatClock: (value: string | null | undefined, timeZone: string) => string
  /** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
  formatWait: (milliseconds: number) => string
  /** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
  formatDay: (value: string | null | undefined, withYear?: boolean) => string
  /** "3 min", "2 h 05", "4 d" between two instants. */
  formatDuration: (milliseconds: number) => string
  /**
   * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min". For what is measured to the ten
   * seconds, where `formatDuration` would round the point away.
   */
  formatSpan: (seconds: number) => string
  /** A moment from now: "in 5 min", "18 min ago"; now itself, to the second, "0 s ago" (never "in 0 s"). */
  formatRelative: (value: string | null | undefined, now?: number) => string
  /** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
  formatBytes: (bytes: number | null | undefined) => string
}

export interface FormatOptions {
  /** The catalogue whose words the formats say (units, "ago"): English's by default. */
  messages?: Messages
  /** A clock of 24 hours or 12: the locale's by default. */
  hourCycle?: HourCycle
}

const made = new WeakMap<Messages, Map<string, Formatters>>()

/** The formats of a locale, in its catalogue's words: made once per locale, catalogue and clock. */
export function formattersFor(locale: string = DEFAULT_LOCALE, { messages = en, hourCycle }: FormatOptions = {}): Formatters {
  const cycle = hourCycle ?? hourCycleOf(locale)
  let byLocale = made.get(messages)
  if (!byLocale) made.set(messages, (byLocale = new Map()))
  const key = `${locale}|${cycle}`
  const known = byLocale.get(key)
  if (known) return known
  const formatters = make(locale, messages, cycle)
  byLocale.set(key, formatters)
  return formatters
}

function make(locale: string, messages: Messages, hourCycle: HourCycle): Formatters {
  const words = bindMessages(messages, locale).format

  // Intl's formats, made once each for their options.
  const numbers = new Map<string, Intl.NumberFormat>()
  const number = (options: Intl.NumberFormatOptions) => {
    const key = JSON.stringify(options)
    let format = numbers.get(key)
    if (!format) numbers.set(key, (format = new Intl.NumberFormat(locale, options)))
    return format
  }
  const dates = new Map<string, Intl.DateTimeFormat>()
  const date = (options: Intl.DateTimeFormatOptions) => {
    const key = JSON.stringify(options)
    let format = dates.get(key)
    if (!format) dates.set(key, (format = new Intl.DateTimeFormat(locale, options)))
    return format
  }
  const decimals = (value: number, digits: number) =>
    number({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)

  const yearIn = (when: Date, timeZone: string) => date({ timeZone, year: 'numeric' }).format(when)

  const formatSpan = (seconds: number) => {
    const total = Math.max(0, Math.round(seconds))
    if (total < 60) return `${total} ${words.seconds}`
    const minutes = Math.floor(total / 60)
    if (minutes < 60) {
      return total % 60 ? `${minutes} ${words.minutes} ${total % 60} ${words.seconds}` : `${minutes} ${words.minutes}`
    }
    return `${Math.floor(minutes / 60)} ${words.hours} ${String(minutes % 60).padStart(2, '0')} ${words.minutes}`
  }

  const formatDuration = (milliseconds: number) => {
    const totalSeconds = Math.max(0, Math.round(milliseconds / 1000))
    if (totalSeconds < 60) return `${totalSeconds} ${words.seconds}`
    const totalMinutes = Math.floor(totalSeconds / 60)
    if (totalMinutes < 60) return `${totalMinutes} ${words.minutes}`
    const hours = Math.floor(totalMinutes / 60)
    if (hours < 48) return `${hours} ${words.hours} ${String(totalMinutes % 60).padStart(2, '0')}`
    return `${Math.floor(hours / 24)} ${words.days}`
  }

  return {
    formatMoney: (value, currency = 'EUR', withSign = false) => {
      if (!isNumber(value)) return EMPTY
      return withTrueMinus(
        number({
          style: 'currency',
          currency: currency || 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          signDisplay: withSign ? 'exceptZero' : 'negative',
        }),
        value,
      )
    },

    formatMoneyCompact: (value) =>
      withTrueMinus(number({ notation: 'compact', maximumFractionDigits: 1, signDisplay: 'negative' }), value),

    formatPercent: (value, withSign = false, digits = 2) => {
      if (!isNumber(value)) return EMPTY
      // In points: 12.4 is 12.4 %. Not grouped ("1234.50%"), as it always was.
      const format = number({
        style: 'percent',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: false,
        signDisplay: withSign ? 'exceptZero' : 'negative',
      })
      return withTrueMinus(format, value / 100)
    },

    formatNumber: (value, digits = 0) => {
      if (!isNumber(value)) return EMPTY
      return withTrueMinus(number({ minimumFractionDigits: digits, maximumFractionDigits: digits, signDisplay: 'negative' }), value)
    },

    formatDateTime: (value, timeZone, withSeconds = true, now = new Date()) => {
      const when = parseDate(value)
      if (!when) return EMPTY
      return date({
        timeZone,
        day: '2-digit',
        month: 'short',
        year: yearIn(when, timeZone) === yearIn(now, timeZone) ? undefined : 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: withSeconds ? '2-digit' : undefined,
        hourCycle,
      }).format(when)
    },

    formatTime: (value, timeZone) => {
      const when = parseDate(value)
      if (!when) return EMPTY
      return date({ timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle }).format(when)
    },

    formatClock: (value, timeZone) => {
      const when = parseDate(value)
      if (!when) return EMPTY
      return date({ timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3, hourCycle }).format(when)
    },

    formatWait: (milliseconds) => {
      const wait = Math.max(0, milliseconds)
      if (wait < 1000) return `${Math.round(wait)} ${words.milliseconds}`
      if (wait < 60_000) return `${decimals(Number((wait / 1000).toFixed(1)), 1)} ${words.seconds}`
      return formatSpan(wait / 1000)
    },

    formatDay: (value, withYear = true) => {
      if (!value) return EMPTY
      const [year, month, day] = value.split('-').map(Number)
      if (!year || !month || !day) return value
      return date({ timeZone: 'UTC', day: '2-digit', month: 'short', year: withYear ? 'numeric' : undefined }).format(
        new Date(Date.UTC(year, month - 1, day)),
      )
    },

    formatDuration,
    formatSpan,

    formatRelative: (value, now = Date.now()) => {
      const when = parseDate(value)
      if (!when) return EMPTY
      const difference = when.getTime() - now
      const duration = formatDuration(Math.abs(difference))
      return difference >= 500 ? words.future(duration) : words.past(duration)
    },

    formatBytes: (bytes) => {
      if (bytes === null || bytes === undefined) return EMPTY
      const units = [words.bytes, words.kilobytes, words.megabytes, words.gigabytes]
      let size = bytes
      let unit = 0
      while (size >= 1000 && unit < units.length - 1) {
        size /= 1000
        unit += 1
      }
      const written = unit === 0 || size >= 100 ? number({ maximumFractionDigits: 0, useGrouping: false }).format(Math.round(size)) : decimals(Number(size.toFixed(1)), 1)
      return `${written} ${units[unit]}`
    },
  }
}

// The functions exported alone: English's (en-GB), made the first time one is called.
let english: Formatters | undefined
const englishFormats = () => (english ??= formattersFor())

/** An amount of money, with an explicit sign when `withSign` (profit and loss). */
export const formatMoney: Formatters['formatMoney'] = (value, currency, withSign) => englishFormats().formatMoney(value, currency, withSign)
/** Compact money for axis ticks: 1.2k, 3.4m. */
export const formatMoneyCompact: Formatters['formatMoneyCompact'] = (value) => englishFormats().formatMoneyCompact(value)
/** A percentage given in points (12.4 is "12.40%"), with an explicit sign when `withSign`. */
export const formatPercent: Formatters['formatPercent'] = (value, withSign, digits) => englishFormats().formatPercent(value, withSign, digits)
/** A number with a fixed number of decimals; a true minus, none on a zero rounded from below. */
export const formatNumber: Formatters['formatNumber'] = (value, digits) => englishFormats().formatNumber(value, digits)
/**
 * A timestamp shown in the time zone given (the one the application's data is about, not the browser's). The year is
 * left out while it is this year's, and written otherwise: a history may go back further than twelve months.
 */
export const formatDateTime: Formatters['formatDateTime'] = (value, timeZone, withSeconds, now) =>
  englishFormats().formatDateTime(value, timeZone, withSeconds, now)
/** A time of day to the second. */
export const formatTime: Formatters['formatTime'] = (value, timeZone) => englishFormats().formatTime(value, timeZone)
/** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
export const formatClock: Formatters['formatClock'] = (value, timeZone) => englishFormats().formatClock(value, timeZone)
/** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
export const formatWait: Formatters['formatWait'] = (milliseconds) => englishFormats().formatWait(milliseconds)
/** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
export const formatDay: Formatters['formatDay'] = (value, withYear) => englishFormats().formatDay(value, withYear)
/** "3 min", "2 h 05", "4 d" between two instants. */
export const formatDuration: Formatters['formatDuration'] = (milliseconds) => englishFormats().formatDuration(milliseconds)
/**
 * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min". For what is measured to the ten
 * seconds, where `formatDuration` would round the point away.
 */
export const formatSpan: Formatters['formatSpan'] = (seconds) => englishFormats().formatSpan(seconds)
/** A moment from now: "in 5 min", "18 min ago"; now itself, to the second, "0 s ago" (never "in 0 s"). */
export const formatRelative: Formatters['formatRelative'] = (value, now) => englishFormats().formatRelative(value, now)
/** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
export const formatBytes: Formatters['formatBytes'] = (bytes) => englishFormats().formatBytes(bytes)

/** ISO day (YYYY-MM-DD) of a local Date, for an API's `from` / `to` parameters. */
export function toIsoDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Which way a figure goes.
 *
 * @deprecated Use `SignTone`. Removed in 1.0. The same three values (`positive`, `negative`, `neutral`), under the name
 * of the package's vocabulary of signs (docs/conventions.md).
 */
export type Tone = SignTone

/** Which way a figure goes: `positive` above zero, `negative` below, `neutral` at zero or for no number. */
export function toneOf(value: number | null | undefined): SignTone {
  if (!isNumber(value) || value === 0) return 'neutral'
  return value > 0 ? 'positive' : 'negative'
}
