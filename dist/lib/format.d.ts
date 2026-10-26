/** An amount of money, with an explicit sign when `withSign` (profit and loss). */
export declare function formatMoney(value: number | null | undefined, currency?: string | null, withSign?: boolean): string;
/** Compact money for axis ticks: 1.2K, 3.4M. */
export declare function formatMoneyCompact(value: number): string;
export declare function formatPercent(value: number | null | undefined, withSign?: boolean, digits?: number): string;
export declare function formatNumber(value: number | null | undefined, digits?: number): string;
/**
 * A timestamp shown in the time zone given (the one the application's data is
 * about, not the browser's). The year is left out while it is this year's, and
 * written otherwise: a history may go back further than twelve months.
 */
export declare function formatDateTime(value: string | null | undefined, timeZone: string, withSeconds?: boolean, now?: Date): string;
export declare function formatTime(value: string | null | undefined, timeZone: string): string;
/** A time of day to the millisecond ("09:31:02.120"), for moments less than a second apart. */
export declare function formatClock(value: string | null | undefined, timeZone: string): string;
/** A short wait: "190 ms" under a second, "3.4 s" under a minute, then as `formatSpan`. */
export declare function formatWait(milliseconds: number): string;
/** A calendar day ("2026-10-11") as "11 Oct 2026", never shifted across time zones: a day is already a day somewhere. */
export declare function formatDay(value: string | null | undefined, withYear?: boolean): string;
/** "3 min", "2 h 05", "4 d" between two instants. */
export declare function formatDuration(milliseconds: number): string;
/**
 * A length of time with its seconds: "50 s", "1 min 50 s", "12 min", "2 h 05 min".
 * For what is measured to the ten seconds, where `formatDuration` would round the point away.
 */
export declare function formatSpan(seconds: number): string;
export declare function formatRelative(value: string | null | undefined, now?: number): string;
/** ISO day (YYYY-MM-DD) of a local Date, for an API's `from` / `to` parameters. */
export declare function toIsoDay(date: Date): string;
export type Tone = 'positive' | 'negative' | 'neutral';
export declare function toneOf(value: number | null | undefined): Tone;
/** A size on disk, in the units a person reads: 48.2 kB, 14.0 MB. */
export declare function formatBytes(bytes: number | null | undefined): string;
