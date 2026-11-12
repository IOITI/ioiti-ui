import type { DateRange } from './ui/calendar.js';
/** A range offered at once: the last so many days (ending on `today`), or a range of its own. */
export interface DateRangePreset {
    label: string;
    days?: number;
    range?: DateRange;
}
interface DateRangeFilterProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    /** The ranges offered first; the last 7, 30 and 90 days by default. */
    presets?: DateRangePreset[];
    /** An "All time" button, after the presets. */
    allTime?: boolean;
    /** The day the presets of days end on: today by default, the last day there is data for otherwise. */
    today?: Date;
    /** The first and the last day the calendar offers. */
    minDate?: Date;
    maxDate?: Date;
}
/** Presets first (the ranges people actually ask for), the calendar for anything else. */
export declare function DateRangeFilter({ value, onChange, presets, allTime, today, minDate, maxDate, }: DateRangeFilterProps): import("react").JSX.Element;
export {};
