import * as React from "react";
import type { WeekDay } from "../../lib/locale.js";
export type DateRange = {
    from: Date | null;
    to: Date | null;
};
interface CalendarBase {
    defaultMonth?: Date;
    minDate?: Date;
    maxDate?: Date;
    isDateDisabled?: (date: Date) => boolean;
    /** The day the weeks start on (0 Sunday, 1 Monday … 6 Saturday): IoitiProvider's by default, its locale's (Monday in en-GB). */
    weekStartsOn?: WeekDay;
    /** The locale its month and days are written in (a picker's button too): IoitiProvider's by default (en-GB outside one). */
    locale?: string;
    className?: string;
}
export type CalendarOptions = Omit<CalendarBase, "className">;
export interface CalendarSingleProps extends CalendarBase {
    mode?: "single";
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
}
export interface CalendarRangeProps extends CalendarBase {
    mode: "range";
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
}
export type CalendarProps = CalendarSingleProps | CalendarRangeProps;
export declare function Calendar(props: CalendarProps): React.JSX.Element;
export {};
