import type { TimeUnit } from '../../lib/date-math.js';
import type { MessageKit } from '../../lib/messages.js';
/** So many of a unit: 15 minutes is `{ count: 15, unit: 'm' }`. */
type Span = {
    count: number;
    unit: TimeUnit;
};
/** TimeRangePicker, AutoRefresh, and the names of ranges and ends (formatTimeRange). */
export declare const timeRange: {
    /** "Today": the day, whole (`now/d` to `now/d`). */
    today: string;
    /** "Yesterday": the day before, whole (`now-1d/d` to `now-1d/d`). */
    yesterday: string;
    /** "Today so far": from the start of the day to now (`now/d` to `now`). */
    todaySoFar: string;
    /** "This week": the week, whole (`now/w` to `now/w`). */
    thisWeek: string;
    /** "This week so far": from the start of the week to now. */
    thisWeekSoFar: string;
    /** "Last week": the week before this one, whole. */
    lastWeek: string;
    /** "This month": the month, whole. */
    thisMonth: string;
    /** "This month so far": from the start of the month to now. */
    thisMonthSoFar: string;
    /** "Last month": the month before this one, whole. */
    lastMonth: string;
    /** "This year": the year, whole. */
    thisYear: string;
    /** "This year so far": from the start of the year to now. */
    thisYearSoFar: string;
    /** "Last 15 minutes", "Last 1 hour": from so long ago to now (`now-15m` to `now`). */
    lastSpan: (span: Span, kit: MessageKit) => string;
    /** "Next 7 days": from now to so long from now (`now` to `now+7d`). */
    nextSpan: (span: Span, kit: MessageKit) => string;
    /** "now": an end of a range that is now. */
    now: string;
    /** "15 minutes ago": an end so long before now (`now-15m`). */
    ago: (span: Span, kit: MessageKit) => string;
    /** "in 2 hours": an end so long after now (`now+2h`). */
    later: (span: Span, kit: MessageKit) => string;
    /** "2 days ago, to the day": an end moved, then rounded to a unit (`now-2d/d`: the day's start, its end for a range's end). */
    rounded: ({ moved, unit }: {
        moved: string;
        unit: TimeUnit;
    }) => string;
    /** "27 Oct 2026, 09:30 → now": a range said by its two ends. */
    ends: ({ from, to }: {
        from: string;
        to: string;
    }) => string;
    /** "→": between the buttons of a range's two ends, for the eye (a screen reader hears each end's name). */
    arrow: string;
    /** ": show its start and its end": said to a screen reader after the range, on the button that shows its two ends. */
    showEnds: string;
    /** "Quick select": the button that opens the ranges offered at once, its popover, and its first section's heading. */
    quickSelect: string;
    /** "Before or after now": the name of the list that says on which side of now a span is. */
    beforeOrAfterNow: string;
    /** "Last": the quick select's span before now ("Last | 15 | minutes"). */
    lastOption: string;
    /** "Next": the quick select's span after now ("Next | 15 | minutes"). */
    nextOption: string;
    /** "How many": the name of the field of a span's count. */
    howMany: string;
    /** "Unit": the name of the list of a span's units. */
    unit: string;
    /** "minutes": a unit in a list, beside the count typed (English's plural whatever the count; a language may agree). */
    unitOption: ({ unit }: Span, _kit: MessageKit) => string;
    /** "Apply": applies the quick select's span. */
    apply: string;
    /** "Commonly used": the heading of the ranges offered at once. */
    commonlyUsed: string;
    /** "Recently used": the heading of the ranges applied last. */
    recentlyUsed: string;
    /** "The start of the range": the name of the popover that sets it. */
    startOfRange: string;
    /** "The end of the range": the name of the popover that sets it. */
    endOfRange: string;
    /** "The start": the name of the tabs of the range's start (a moment, a time from now, now). */
    startTabs: string;
    /** "The end": the name of the tabs of the range's end. */
    endTabs: string;
    /** "Absolute": the tab of an end set as a moment, on the calendar. */
    absolute: string;
    /** "Relative": the tab of an end set as so long before or after now. */
    relative: string;
    /** "Now": the tab of an end that is now. */
    nowTab: string;
    /** "Time": the name of the field of an end's time of day. */
    time: string;
    /** "ago": an end so long before now ("15 | minutes | ago"). */
    agoOption: string;
    /** "from now": an end so long after now ("15 | minutes | from now"). */
    fromNowOption: string;
    /** "Round to the minute": the box that rounds an end to its unit (to the unit's start; its end for the range's end). */
    roundTo: (unit: TimeUnit) => string;
    /** "Now is the moment the range is read: each refresh moves it.": what the tab Now says. */
    nowExplained: string;
    /** "Set the start to now": the button of the tab Now, for the range's start. */
    setStartToNow: string;
    /** "Set the end to now": the button of the tab Now, for the range's end. */
    setEndToNow: string;
    /** "Update": applies the two ends set. */
    update: string;
    /** "Refresh": asks for the range's data again. */
    refresh: string;
    /** "Refreshing": the button Refresh while the data is on its way. */
    refreshing: string;
    /** "Refresh": the name of AutoRefresh's popover, where it is set and stopped. */
    autoRefresh: string;
    /** "Off": AutoRefresh's button while it is stopped. */
    refreshOff: string;
    /** "Every 30 s", "Every 5 min": AutoRefresh's button while it runs. */
    refreshEvery: ({ count, unit }: {
        count: number;
        unit: "s" | "m" | "h";
    }, { number }: MessageKit) => string;
    /** "Refresh every": the heading of where the refresh is set, and the name of the field of its count. */
    refreshInterval: string;
    /** "Unit of the refresh": the name of the list of its units. */
    refreshUnit: string;
    /** "Start": starts refreshing. */
    startRefresh: string;
    /** "Stop": stops refreshing. */
    stopRefresh: string;
};
export {};
