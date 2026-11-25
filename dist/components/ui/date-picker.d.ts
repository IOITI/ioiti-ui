import * as React from "react";
import { type CalendarOptions, type DateRange } from "./calendar.js";
import { type DataAttributes } from "../../lib/data-attributes.js";
type Side = "bottom" | "top";
/** ioiti-ui: what names and describes the trigger, and says it is wrong: a Field's, a label's elsewhere. */
export interface PickerFieldProps {
    /** The trigger's id, for a `<label htmlFor>` (a Field's `htmlFor`); in a FormItem, the item's. */
    id?: string;
    /** Its name, where no label names it. */
    "aria-label"?: string;
    /** The id of what names it. A Field's label names it without it. */
    "aria-labelledby"?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    "aria-describedby"?: string;
    /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
    "aria-invalid"?: boolean | "true" | "false";
    /** The date chosen is wrong (or missing): the trigger's border in the error's colour, and said. */
    error?: boolean;
    /** Its trigger (the button that shows the day), to focus it. */
    ref?: React.Ref<HTMLButtonElement>;
}
export interface DatePickerProps extends CalendarOptions, PickerFieldProps, DataAttributes {
    value?: Date | null;
    defaultValue?: Date | null;
    onChange?: (date: Date | null) => void;
    /** What its button says while no day is chosen: "Pick a date" by default, in the provider's words (`date.datePlaceholder`). */
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
    /** ioiti-ui: the name its day is sent under with a form (a hidden input), as a date field sends it: `yyyy-mm-dd`, empty while none is chosen. */
    name?: string;
}
export declare function DatePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, name, ref, ...others }: DatePickerProps): React.JSX.Element;
export interface DateRangePickerProps extends CalendarOptions, PickerFieldProps, DataAttributes {
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange) => void;
    /** What its button says while no range is chosen: "Pick a range" by default, in the provider's words (`date.rangePlaceholder`). */
    placeholder?: string;
    align?: "start" | "end";
    side?: Side | "auto";
    disabled?: boolean;
    className?: string;
    /**
     * ioiti-ui: the name its range is sent under with a form: two values, its first day then its last (`yyyy-mm-dd`,
     * empty while not chosen), a hidden input each with this name.
     */
    name?: string;
}
export declare function DateRangePicker({ value, defaultValue, onChange, placeholder, align, side, disabled, className, id, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, name, ref, ...others }: DateRangePickerProps): React.JSX.Element;
export {};
