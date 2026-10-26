import type { DateRange } from './ui/calendar.js';
interface DateRangeFilterProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}
/** Presets first (the ranges people actually ask for), the calendar for anything else. */
export declare function DateRangeFilter({ value, onChange }: DateRangeFilterProps): import("react").JSX.Element;
export {};
