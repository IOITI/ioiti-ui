import type { MessageKit } from '../../lib/messages.js'

/** Calendar, DatePicker, DateRangePicker, DateRangeFilter. */
export const date = {
  /** "Previous month": the calendar's button to the month before. */
  previousMonth: 'Previous month',
  /** "Next month": the calendar's button to the month after. */
  nextMonth: 'Next month',
  /** "Choose date": the name of a picker's calendar, opened over the page (DatePicker, DateRangePicker). */
  pickerDialog: 'Choose date',
  /** "Pick a date": what DatePicker's button says while no day is chosen. */
  datePlaceholder: 'Pick a date',
  /** "Pick a range": what DateRangePicker's button says while no range is chosen. */
  rangePlaceholder: 'Pick a range',
  /** "14 Nov 2026 – 20 Nov 2026", "14 Nov 2026 – …" while its last day is not chosen: the range a picker's button says. */
  range: ({ from, to }: { from: string; to?: string }) => `${from} – ${to ?? '…'}`,
  /** "7 days": a preset of DateRangeFilter, the last so many days. */
  lastDays: (count: number, { plural }: MessageKit) => plural(count, { one: '# day', other: '# days' }),
  /** "All time": DateRangeFilter's button for every day there is. */
  allTime: 'All time',
  /** "Custom range": what DateRangeFilter's calendar button says while the range is no preset's. */
  customRange: 'Custom range',
}
