import type { MessageKit } from '../../lib/messages.js';
/** Calendar, DatePicker, DateRangePicker, DateRangeFilter. */
export declare const date: {
    /** "Previous month": the calendar's button to the month before. */
    previousMonth: string;
    /** "Next month": the calendar's button to the month after. */
    nextMonth: string;
    /** "Choose date": the name of a picker's calendar, opened over the page (DatePicker, DateRangePicker). */
    pickerDialog: string;
    /** "Pick a date": what DatePicker's button says while no day is chosen. */
    datePlaceholder: string;
    /** "Pick a range": what DateRangePicker's button says while no range is chosen. */
    rangePlaceholder: string;
    /** "14 Nov 2026 – 20 Nov 2026", "14 Nov 2026 – …" while its last day is not chosen: the range a picker's button says. */
    range: ({ from, to }: {
        from: string;
        to?: string;
    }) => string;
    /** "7 days": a preset of DateRangeFilter, the last so many days. */
    lastDays: (count: number, { plural }: MessageKit) => string;
    /** "All time": DateRangeFilter's button for every day there is. */
    allTime: string;
    /** "Custom range": what DateRangeFilter's calendar button says while the range is no preset's. */
    customRange: string;
};
