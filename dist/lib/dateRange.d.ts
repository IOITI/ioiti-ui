import type { DateRange } from '../components/ui/calendar.js';
export declare const ALL_TIME: DateRange;
export declare function lastDays(days: number, today?: Date): DateRange;
/** The range as an API's `from` / `to` days. A range still being picked (no end yet) is open-ended. */
export declare function rangeParams(range: DateRange): {
    from: string | null;
    to: string | null;
};
