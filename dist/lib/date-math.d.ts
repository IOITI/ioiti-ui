import type { DateRange } from '../components/ui/calendar.js';
import type { Messages } from '../locales/en.js';
import type { HourCycle, WeekDay } from './locale.js';
export interface TimeRange {
    from: string;
    to: string;
}
export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';
export declare const TIME_UNITS: TimeUnit[];
export interface DateMathOptions {
    /** The time now, in milliseconds. */
    now?: number;
    /** The end of a range: rounded up to the unit's end (`now/d` is the day's last moment). */
    roundUp?: boolean;
    /** The day weeks start on (0 Sunday, 1 Monday … 6 Saturday), for a week rounded (`now/w`): Monday by default. */
    weekStartsOn?: WeekDay;
}
/** The moment an end of a range stands for, or `null` where it is not one. */
export declare function parseDateMath(text: string, { now, roundUp, weekStartsOn }?: DateMathOptions): Date | null;
/** The two moments of a range, for a query (`rangeParams`), its end rounded up; `null` for what cannot be read. */
export declare function resolveTimeRange(range: TimeRange, options?: Omit<DateMathOptions, 'roundUp'>): DateRange;
export interface RelativeEnd {
    count: number;
    unit: TimeUnit;
    /** Before now (`ago`) or after it. */
    past: boolean;
    /** The unit it is rounded to, if it is. */
    round?: TimeUnit;
}
/** An end written as `now` moved by one step, and maybe rounded (`now-15m`, `now-1d/d`): its parts. */
export declare function relativeEnd(text: string): RelativeEnd | null;
/** How a range or an end is said: in which words, and with which clock and week. */
export interface TimeRangeWordsOptions {
    /**
     * The words: a catalogue's (`fr.timeRange`, an application's), or a provider's as `useMessages().timeRange` gives them,
     * bound to its locale. English's by default.
     */
    words?: Messages['timeRange'];
    /** The clock of a moment written out, 24 hours (`h23`) or 12 (`h12`): the locale's by default. */
    hourCycle?: HourCycle;
    /** The day weeks start on, for an end written out as the moment it stands for (`now/w`): Monday by default. */
    weekStartsOn?: WeekDay;
    /** The time now, in milliseconds, for an end written out as the moment it stands for. */
    now?: number;
}
export interface TimeRangeEndOptions extends TimeRangeWordsOptions {
    /** The end of a range: a moment rounded up to its unit's end, as `resolveTimeRange` reads it (`now/d`: 23:59). */
    roundUp?: boolean;
}
/**
 * An end of a range in words: "now", "15 minutes ago", "2 days ago, to the day", or else the moment it stands for,
 * "27 Oct 2026, 09:30" (`now/d` too: an end alone names no range); what cannot be read, as it is written.
 */
export declare function formatTimeRangeEnd(text: string, locale?: string, options?: TimeRangeEndOptions): string;
/**
 * A range in words: "Last 15 minutes", "Today", or its two ends, "27 Oct 2026, 09:30 → now". In English, its moments as
 * Britain writes them, by default; in another language with its words (`formatTimeRange(range, 'fr-FR', { words:
 * fr.timeRange })`, or a component's `useMessages().timeRange` with `useLocale()`'s locale, clock and week).
 */
export declare function formatTimeRange(range: TimeRange, locale?: string, options?: TimeRangeWordsOptions): string;
