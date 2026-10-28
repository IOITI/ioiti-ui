/** A "nice" step (1, 2, 2.5 or 5 times a power of ten) near `raw`. */
export declare function niceStep(raw: number): number;
export interface Domain {
    min: number;
    max: number;
    step: number;
    ticks: number[];
}
/**
 * An axis over the values from `min` to `max` in about `count` nice steps, zero on it (a bar starts there):
 * `niceDomain(-120, 340)` is −200 to 400 by 200. Without `zero`, it fits the values (a price far from zero).
 */
export declare function niceDomain(min: number, max: number, count?: number, zero?: boolean): Domain;
export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month';
/** How far a time zone is ahead of UTC at an instant, in milliseconds. */
export declare function zoneOffset(at: number, timeZone: string): number;
export interface TimeTicks {
    ticks: number[];
    unit: TimeUnit;
}
/**
 * Times for the axis of a span, at most `count` of them, on round moments of the time zone's clock (the
 * hour, midnight): the shortest interval of a second to a year that keeps within `count`.
 */
export declare function timeTicks(from: number, to: number, count: number, timeZone?: string): TimeTicks;
/** A time of the axis, as its unit reads it: "09:30", "07 Oct" (a day as `formatDay` writes it), "Oct 2026". */
export declare function formatTimeTick(at: number, unit: TimeUnit, timeZone?: string): string;
