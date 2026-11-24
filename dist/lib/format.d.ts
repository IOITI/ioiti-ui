import type { Messages } from '../locales/en.js';
import type { HourCycle } from './locale.js';
/** The formats of a locale: the same functions as the ones exported alone, in its ways and words. */
export interface Formatters {
    /** An amount of money, with an explicit sign when `withSign` (profit and loss); a minus where it is a loss. */
    formatMoney: (value: number | null | undefined, currency?: string | null, withSign?: boolean) => string;
    /** Compact money for axis ticks: 1.2k, 3.4m. */
    formatMoneyCompact: (value: number) => string;
    /** A percentage given in points (12.4 is "12.40%"), with an explicit sign when `withSign`. */
    formatPercent: (value: number | null | undefined, withSign?: boolean, digits?: number) => string;
    /** A number with a fixed number of decimals; a true minus, none on a zero rounded from below. */
    formatNumber: (value: number | null | undefined, digits?: number) => string;
    /**
     * A timestamp shown in the time zone given (the one the application's data is about, not the browser's). The year is
     * left out while it is this year's, and written otherwise: a history may go back further than twelve months.
     */
    formatDateTime: (value: string | null | undefined, timeZone: string, withSeconds?: boolean, now?: Date) => string;
    /** A time of day to the second. */
    formatTime: (value: string | null | undefined, timeZone: string) => string;
    /** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
    formatClock: (value: string | null | undefined, timeZone: string) => string;
    /** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
    formatWait: (milliseconds: number) => string;
    /** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
    formatDay: (value: string | null | undefined, withYear?: boolean) => string;
    /** "3 min", "2 h 05", "4 d" between two instants. */
    formatDuration: (milliseconds: number) => string;
    /**
     * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min". For what is measured to the ten
     * seconds, where `formatDuration` would round the point away.
     */
    formatSpan: (seconds: number) => string;
    /** A moment from now: "in 5 min", "18 min ago"; now itself, to the second, "0 s ago" (never "in 0 s"). */
    formatRelative: (value: string | null | undefined, now?: number) => string;
    /** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
    formatBytes: (bytes: number | null | undefined) => string;
}
export interface FormatOptions {
    /** The catalogue whose words the formats say (units, "ago"): English's by default. */
    messages?: Messages;
    /** A clock of 24 hours or 12: the locale's by default. */
    hourCycle?: HourCycle;
}
/** The formats of a locale, in its catalogue's words: made once per locale, catalogue and clock. */
export declare function formattersFor(locale?: string, { messages, hourCycle }?: FormatOptions): Formatters;
/** An amount of money, with an explicit sign when `withSign` (profit and loss). */
export declare const formatMoney: Formatters['formatMoney'];
/** Compact money for axis ticks: 1.2k, 3.4m. */
export declare const formatMoneyCompact: Formatters['formatMoneyCompact'];
/** A percentage given in points (12.4 is "12.40%"), with an explicit sign when `withSign`. */
export declare const formatPercent: Formatters['formatPercent'];
/** A number with a fixed number of decimals; a true minus, none on a zero rounded from below. */
export declare const formatNumber: Formatters['formatNumber'];
/**
 * A timestamp shown in the time zone given (the one the application's data is about, not the browser's). The year is
 * left out while it is this year's, and written otherwise: a history may go back further than twelve months.
 */
export declare const formatDateTime: Formatters['formatDateTime'];
/** A time of day to the second. */
export declare const formatTime: Formatters['formatTime'];
/** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
export declare const formatClock: Formatters['formatClock'];
/** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
export declare const formatWait: Formatters['formatWait'];
/** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
export declare const formatDay: Formatters['formatDay'];
/** "3 min", "2 h 05", "4 d" between two instants. */
export declare const formatDuration: Formatters['formatDuration'];
/**
 * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min". For what is measured to the ten
 * seconds, where `formatDuration` would round the point away.
 */
export declare const formatSpan: Formatters['formatSpan'];
/** A moment from now: "in 5 min", "18 min ago"; now itself, to the second, "0 s ago" (never "in 0 s"). */
export declare const formatRelative: Formatters['formatRelative'];
/** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
export declare const formatBytes: Formatters['formatBytes'];
/** ISO day (YYYY-MM-DD) of a local Date, for an API's `from` / `to` parameters. */
export declare function toIsoDay(date: Date): string;
export type Tone = 'positive' | 'negative' | 'neutral';
export declare function toneOf(value: number | null | undefined): Tone;
