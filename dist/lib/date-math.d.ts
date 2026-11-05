import type { DateRange } from '../components/ui/calendar.js';
export interface TimeRange {
    from: string;
    to: string;
}
export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y';
export declare const TIME_UNITS: TimeUnit[];
/** A unit's name for a count: "1 minute", "15 minutes". */
export declare function unitName(unit: TimeUnit, count: number): string;
export interface DateMathOptions {
    /** The time now, in milliseconds. */
    now?: number;
    /** The end of a range: rounded up to the unit's end (`now/d` is the day's last moment). */
    roundUp?: boolean;
    /** The day weeks start on: 1 for Monday (the default), 0 for Sunday. */
    weekStartsOn?: number;
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
/** A range in words: "Last 15 minutes", "Today", or its two ends, "27 Oct 2026, 09:30 → now". */
export declare function formatTimeRange(range: TimeRange, locale?: string): string;
