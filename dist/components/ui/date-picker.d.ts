import * as React from "react";
import { type CalendarOptions, type DateRange } from "./calendar.js";
type Side = "bottom" | "top";
/** ioiti-ui: what names and describes the trigger, and says it is wrong: a Field's, a label's elsewhere. */
export interface PickerFieldProps {
    /** The trigger's id, for a `<label htmlFor>` (a Field's `htmlFor`). */
    id?: string;
    /** Its name, where no label names it. */
    "aria-label"?: string;
    /** The id of what names it. */
    "aria-labelledby"?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    "aria-describedby"?: string;
    /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
    "aria-invalid"?: boolean | "true" | "false";
    /** The date chosen is wrong (or missing): the trigger's border in the error's colour, and said. */
    error?: boolean;
}
export interface DatePickerProps extends CalendarOptions, PickerFieldProps {
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
}
export declare function DatePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ...calendar }: DatePickerProps): React.JSX.Element;
export interface DateRangePickerProps extends CalendarOptions, PickerFieldProps {
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
}
export declare function DateRangePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, ...calendar }: DateRangePickerProps): React.JSX.Element;
export {};
