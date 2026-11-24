import * as React from "react";
import { type CalendarOptions, type DateRange } from "./calendar.js";
type Side = "bottom" | "top";
export interface DatePickerProps extends CalendarOptions {
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
}
export declare function DatePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, ...calendar }: DatePickerProps): React.JSX.Element;
export interface DateRangePickerProps extends CalendarOptions {
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
}
export declare function DateRangePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, ...calendar }: DateRangePickerProps): React.JSX.Element;
export {};
