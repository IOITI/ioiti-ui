import * as React from "react";
export type DateRange = {
    from: Date | null;
    to: Date | null;
};
interface CalendarBase {
    defaultMonth?: Date;
    minDate?: Date;
    maxDate?: Date;
    isDateDisabled?: (date: Date) => boolean;
    weekStartsOn?: 0 | 1;
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
