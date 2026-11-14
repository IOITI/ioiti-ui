import { CalendarDays } from 'lucide-react'

import type { CategoryInfo } from '../../catalogue/types'

const dates: CategoryInfo = {
  slug: 'dates',
  label: 'Dates and time',
  icon: CalendarDays,
  summary: 'A day, a range of days or of time, a moment said from now, the time elsewhere: weeks start on Monday, days are written as en-GB writes them.',
  families: [
    {
      slug: 'calendar',
      name: 'Calendar',
      names: ['Calendar'],
      keywords: ['month', 'day', 'date grid'],
      examples: [
        { id: 'single', title: 'One day', description: 'A month of days to choose one from, always open: the arrows move by a day, Page Up and Down by a month. Today is marked, not filled.' },
        { id: 'range', title: 'A range of days', description: 'mode="range": a first press sets its start, a second its end, the days between filled as the pointer moves.' },
        { id: 'limits', title: 'Days that cannot be chosen', description: 'The days before and after the ones offered (minDate, maxDate), and those a rule leaves out (isDateDisabled): no delivery on a weekend.' },
      ],
    },
    {
      slug: 'date-picker',
      name: 'DatePicker',
      names: ['DatePicker', 'DateRangePicker'],
      keywords: ['date input', 'date field', 'range picker'],
      examples: [
        { id: 'day', title: 'A day from a field', description: 'The field says the day as en-GB writes it, its calendar opens under it. Empty, its placeholder says what is asked.' },
        { id: 'range', title: 'A range from a field', description: 'DateRangePicker: two presses in its calendar, the range written in the field; rangeParams gives its days for an API.' },
        { id: 'limits', title: 'Bounded, or disabled', description: 'Only the days that can be chosen are offered: weekdays, between a first and a last day. Disabled, its range stays readable.' },
      ],
    },
    {
      slug: 'date-range-filter',
      name: 'DateRangeFilter',
      names: ['DateRangeFilter'],
      keywords: ['period', 'presets', 'last 30 days', 'filter'],
      examples: [
        { id: 'presets', title: 'The ranges people ask for', description: 'The last 7, 30 and 90 days, then all time, as buttons, the one shown filled; a calendar for any other range.' },
        { id: 'data-days', title: 'Ending on the last day of data', description: 'Presets of the page’s own (days, or a range), ending on the last day there is data for (today, maxDate), no “All time”.' },
      ],
    },
    {
      slug: 'time-range-picker',
      name: 'TimeRangePicker',
      names: ['TimeRangePicker', 'AutoRefresh'],
      keywords: ['time range', 'relative time', 'refresh', 'last 24 hours', 'date math'],
      examples: [
        { id: 'refreshed', title: 'A range that stays true', description: 'A range of time as people say it, which stays true as time goes by: chosen in two clicks or its ends set one by one, applied with Update; refreshed by a press or on a timer, which waits while the page’s tab is hidden.' },
        { id: 'commonly-used', title: 'Ranges of the page’s own', description: 'commonlyUsed puts the ranges a page is read over first: a shift, a working week. formatTimeRange says the range in words.' },
        { id: 'auto-refresh', title: 'AutoRefresh alone', description: 'Beside a page’s title: how often the page is refreshed, its icon turning while it runs, off until it is started.' },
      ],
    },
    {
      slug: 'relative-time',
      name: 'RelativeTime',
      names: ['RelativeTime'],
      keywords: ['time ago', 'timestamp', 'from now'],
      examples: [
        { id: 'ages', title: 'Past and to come', description: 'A moment said from now, kept true as time goes by (each second under a minute, each minute after), its full date in a hint and for a screen reader.' },
        { id: 'past', title: 'A clock ahead of this one', description: 'A moment that has happened, taken on a clock a little ahead of this one (a server’s), is said just past with past, never to come.' },
        { id: 'in-a-list', title: 'In a list of events', description: 'Each line’s time at its end, in a column of digits of one width; every time on the page shares one clock for each precision.' },
      ],
    },
    {
      slug: 'airport-matrix-clock',
      name: 'AirportMatrixClock',
      names: ['AirportMatrixClock'],
      keywords: ['world clock', 'time zones', 'departures board'],
      examples: [
        { id: 'cities', title: 'Several cities', description: 'The time of a few cities, as a departures board; a row’s characters flip under the pointer.' },
        { id: 'beside-a-title', title: 'Small, beside a title', description: 'size="sm" and no title: two of them fit beside a page’s title.' },
        { id: 'seconds', title: 'Seconds, in the page’s words', description: 'showSeconds, a 12-hour time, five cities at most; its title and its footer in the page’s words.' },
      ],
    },
  ],
}

export default dates
