import type { TimeRange } from '../lib/date-math.js';
export interface CommonRange {
    label: string;
    range: TimeRange;
}
export interface RefreshSettings {
    /** Milliseconds between two refreshes. */
    interval: number;
    paused: boolean;
}
interface AutoRefreshProps {
    /** How often, and whether it is stopped. */
    value: RefreshSettings;
    onChange: (settings: RefreshSettings) => void;
    /** Called each time it is due. */
    onRefresh: () => void;
    className?: string;
}
/**
 * Refreshes what a page shows on a timer: a button saying how often ("Every 30 s", "Off") that opens
 * where it is set and stopped. It waits while the page's tab is hidden, and starts again when it is back.
 */
export declare function AutoRefresh({ value, onChange, onRefresh, className }: AutoRefreshProps): import("react").JSX.Element;
interface TimeRangePickerProps {
    /** The range applied: each end `now`, `now` moved and rounded (`now-15m`, `now/d`), or an ISO moment. */
    value?: TimeRange;
    defaultValue?: TimeRange;
    /** A new range applied (quick select, a range commonly used, or Update). */
    onChange?: (range: TimeRange) => void;
    /** Asked for fresh data: on Refresh, on each new range, and on the timer where there is one. */
    onRefresh?: (range: TimeRange) => void;
    /** Data is on its way: Refresh shows it. */
    isLoading?: boolean;
    /** The ranges offered at once, in place of the usual ones. */
    commonlyUsed?: CommonRange[];
    /** Refreshing on a timer: shown in the quick select when given with `onRefreshChange`. */
    refresh?: RefreshSettings;
    onRefreshChange?: (settings: RefreshSettings) => void;
    locale?: string;
    weekStartsOn?: 0 | 1;
    className?: string;
}
/**
 * A range of time, said as people say it ("Last 15 minutes", "Today") and kept true as time goes by:
 * a range chosen in two clicks (quick select, the ranges commonly used, those recently used), or its two
 * ends set one by one (a moment on the calendar, a time from now, now) and applied with Update; refreshed
 * by a press, or on a timer. As Elastic UI's super date picker does.
 */
export declare function TimeRangePicker({ value, defaultValue, onChange, onRefresh, isLoading, commonlyUsed, refresh, onRefreshChange, locale, weekStartsOn, className, }: TimeRangePickerProps): import("react").JSX.Element;
export {};
