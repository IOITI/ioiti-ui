import type { Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
import type { TimeRange } from '../lib/date-math.js';
import type { WeekDay } from '../lib/locale.js';
export interface CommonRange {
    label: string;
    range: TimeRange;
}
export interface RefreshSettings {
    /** Milliseconds between two refreshes. */
    interval: number;
    paused: boolean;
}
/** The props of `AutoRefresh`. */
export interface AutoRefreshProps {
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
export interface TimeRangePickerProps extends DataAttributes {
    /** The range applied: each end `now`, `now` moved and rounded (`now-15m`, `now/d`), or an ISO moment. */
    value?: TimeRange;
    defaultValue?: TimeRange;
    /** A new range applied (quick select, a range commonly used, or Update). */
    onChange?: (range: TimeRange) => void;
    /** Asked for fresh data: on Refresh, on each new range, and on the timer where there is one. */
    onRefresh?: (range: TimeRange) => void;
    /** Data is on its way: Refresh shows it. */
    loading?: boolean;
    /** @deprecated Use `loading`. Removed in 1.0. */
    isLoading?: boolean;
    /**
     * The ranges offered at once, in place of the usual ones: today, this week, the last 15 and 30 minutes, hour, 24 hours,
     * 7, 30 and 90 days, and year, each named as `formatTimeRange` names it, in the provider's words.
     */
    commonlyUsed?: CommonRange[];
    /** Refreshing on a timer: shown in the quick select when given with `onRefreshChange`. */
    refresh?: RefreshSettings;
    onRefreshChange?: (settings: RefreshSettings) => void;
    /** The locale its moments and its calendar are written in: the provider's by default (IoitiProvider's; en-GB outside one). */
    locale?: string;
    /**
     * The day its weeks start on (0 Sunday, 1 Monday … 6 Saturday): its calendar's first column, and the start of a week a
     * range is rounded to (`now/w`). The provider's by default (its locale's: Monday in en-GB, Sunday in en-US).
     */
    weekStartsOn?: WeekDay;
    className?: string;
    /** The group's id (what holds its buttons), for a `<label htmlFor>`; in a FormItem, the item's. */
    id?: string;
    /**
     * The name its range is sent under with a form: two values, its start then its end, as `value` writes them
     * (`now-15m`, `now`, an ISO moment), a hidden input each with this name.
     */
    name?: string;
    /** The group's name: what the range is for ("Period of the logs"). */
    'aria-label'?: string;
    /** The id of what names the group: a heading. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it: its frame in the negative colour. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** The group (its outermost element), which holds its buttons. */
    ref?: Ref<HTMLDivElement>;
}
/**
 * A range of time, said as people say it ("Last 15 minutes", "Today") and kept true as time goes by:
 * a range chosen in two clicks (quick select, the ranges commonly used, those recently used), or its two
 * ends set one by one (a moment on the calendar, a time from now, now) and applied with Update; refreshed
 * by a press, or on a timer. As Elastic UI's super date picker does.
 */
export declare function TimeRangePicker({ value, defaultValue, onChange, onRefresh, loading: givenLoading, isLoading, commonlyUsed, refresh, onRefreshChange, locale, weekStartsOn, className, id, name, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }: TimeRangePickerProps): import("react").JSX.Element;
