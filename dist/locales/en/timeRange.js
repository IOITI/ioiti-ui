// A unit's name for one and for several.
const UNITS = {
    s: { one: 'second', other: 'seconds' },
    m: { one: 'minute', other: 'minutes' },
    h: { one: 'hour', other: 'hours' },
    d: { one: 'day', other: 'days' },
    w: { one: 'week', other: 'weeks' },
    M: { one: 'month', other: 'months' },
    y: { one: 'year', other: 'years' },
};
/** "15 minutes", "1 hour". */
const counted = ({ count, unit }, { plural }) => plural(count, { one: `# ${UNITS[unit].one}`, other: `# ${UNITS[unit].other}` });
// The units of a refresh, as AutoRefresh's button writes them.
const SHORT = { s: 's', m: 'min', h: 'h' };
/** TimeRangePicker, AutoRefresh, and the names of ranges and ends (formatTimeRange). */
export const timeRange = {
    /** "Today": the day, whole (`now/d` to `now/d`). */
    today: 'Today',
    /** "Yesterday": the day before, whole (`now-1d/d` to `now-1d/d`). */
    yesterday: 'Yesterday',
    /** "Today so far": from the start of the day to now (`now/d` to `now`). */
    todaySoFar: 'Today so far',
    /** "This week": the week, whole (`now/w` to `now/w`). */
    thisWeek: 'This week',
    /** "This week so far": from the start of the week to now. */
    thisWeekSoFar: 'This week so far',
    /** "Last week": the week before this one, whole. */
    lastWeek: 'Last week',
    /** "This month": the month, whole. */
    thisMonth: 'This month',
    /** "This month so far": from the start of the month to now. */
    thisMonthSoFar: 'This month so far',
    /** "Last month": the month before this one, whole. */
    lastMonth: 'Last month',
    /** "This year": the year, whole. */
    thisYear: 'This year',
    /** "This year so far": from the start of the year to now. */
    thisYearSoFar: 'This year so far',
    /** "Last 15 minutes", "Last 1 hour": from so long ago to now (`now-15m` to `now`). */
    lastSpan: (span, kit) => `Last ${counted(span, kit)}`,
    /** "Next 7 days": from now to so long from now (`now` to `now+7d`). */
    nextSpan: (span, kit) => `Next ${counted(span, kit)}`,
    /** "now": an end of a range that is now. */
    now: 'now',
    /** "15 minutes ago": an end so long before now (`now-15m`). */
    ago: (span, kit) => `${counted(span, kit)} ago`,
    /** "in 2 hours": an end so long after now (`now+2h`). */
    later: (span, kit) => `in ${counted(span, kit)}`,
    /** "2 days ago, to the day": an end moved, then rounded to a unit (`now-2d/d`: the day's start, its end for a range's end). */
    rounded: ({ moved, unit }) => `${moved}, to the ${UNITS[unit].one}`,
    /** "27 Oct 2026, 09:30 → now": a range said by its two ends. */
    ends: ({ from, to }) => `${from} → ${to}`,
    /** "→": between the buttons of a range's two ends, for the eye (a screen reader hears each end's name). */
    arrow: '→',
    /** ": show its start and its end": said to a screen reader after the range, on the button that shows its two ends. */
    showEnds: ': show its start and its end',
    /** "Quick select": the button that opens the ranges offered at once, its popover, and its first section's heading. */
    quickSelect: 'Quick select',
    /** "Before or after now": the name of the list that says on which side of now a span is. */
    beforeOrAfterNow: 'Before or after now',
    /** "Last": the quick select's span before now ("Last | 15 | minutes"). */
    lastOption: 'Last',
    /** "Next": the quick select's span after now ("Next | 15 | minutes"). */
    nextOption: 'Next',
    /** "How many": the name of the field of a span's count. */
    howMany: 'How many',
    /** "Unit": the name of the list of a span's units. */
    unit: 'Unit',
    /** "minutes": a unit in a list, beside the count typed (English's plural whatever the count; a language may agree). */
    unitOption: ({ unit }, _kit) => UNITS[unit].other,
    /** "Apply": applies the quick select's span. */
    apply: 'Apply',
    /** "Commonly used": the heading of the ranges offered at once. */
    commonlyUsed: 'Commonly used',
    /** "Recently used": the heading of the ranges applied last. */
    recentlyUsed: 'Recently used',
    /** "The start of the range": the name of the popover that sets it. */
    startOfRange: 'The start of the range',
    /** "The end of the range": the name of the popover that sets it. */
    endOfRange: 'The end of the range',
    /** "The start": the name of the tabs of the range's start (a moment, a time from now, now). */
    startTabs: 'The start',
    /** "The end": the name of the tabs of the range's end. */
    endTabs: 'The end',
    /** "Absolute": the tab of an end set as a moment, on the calendar. */
    absolute: 'Absolute',
    /** "Relative": the tab of an end set as so long before or after now. */
    relative: 'Relative',
    /** "Now": the tab of an end that is now. */
    nowTab: 'Now',
    /** "Time": the name of the field of an end's time of day. */
    time: 'Time',
    /** "ago": an end so long before now ("15 | minutes | ago"). */
    agoOption: 'ago',
    /** "from now": an end so long after now ("15 | minutes | from now"). */
    fromNowOption: 'from now',
    /** "Round to the minute": the box that rounds an end to its unit (to the unit's start; its end for the range's end). */
    roundTo: (unit) => `Round to the ${UNITS[unit].one}`,
    /** "Now is the moment the range is read: each refresh moves it.": what the tab Now says. */
    nowExplained: 'Now is the moment the range is read: each refresh moves it.',
    /** "Set the start to now": the button of the tab Now, for the range's start. */
    setStartToNow: 'Set the start to now',
    /** "Set the end to now": the button of the tab Now, for the range's end. */
    setEndToNow: 'Set the end to now',
    /** "Update": applies the two ends set. */
    update: 'Update',
    /** "Refresh": asks for the range's data again. */
    refresh: 'Refresh',
    /** "Refreshing": the button Refresh while the data is on its way. */
    refreshing: 'Refreshing',
    /** "Refresh": the name of AutoRefresh's popover, where it is set and stopped. */
    autoRefresh: 'Refresh',
    /** "Off": AutoRefresh's button while it is stopped. */
    refreshOff: 'Off',
    /** "Every 30 s", "Every 5 min": AutoRefresh's button while it runs. */
    refreshEvery: ({ count, unit }, { number }) => `Every ${number(count)} ${SHORT[unit]}`,
    /** "Refresh every": the heading of where the refresh is set, and the name of the field of its count. */
    refreshInterval: 'Refresh every',
    /** "Unit of the refresh": the name of the list of its units. */
    refreshUnit: 'Unit of the refresh',
    /** "Start": starts refreshing. */
    startRefresh: 'Start',
    /** "Stop": stops refreshing. */
    stopRefresh: 'Stop',
};
