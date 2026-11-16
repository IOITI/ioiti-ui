import * as React from "react";
export interface ComboboxOption {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    keywords?: string[];
    disabled?: boolean;
}
export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    align?: "start" | "end";
    disabled?: boolean;
    className?: string;
    "aria-label"?: string;
    /** ioiti-ui: the trigger's id, for a `<label htmlFor>`. */
    id?: string;
    /** ioiti-ui: the id of what names it. */
    "aria-labelledby"?: string;
    /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
    "aria-describedby"?: string;
    /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
    "aria-invalid"?: boolean | "true" | "false";
    /** ioiti-ui: the choice is wrong (or missing): the trigger's border in the error's colour, and said. */
    error?: boolean;
}
export declare function Combobox({ options, value, defaultValue, onValueChange, placeholder, searchPlaceholder, emptyText, align, disabled, className, "aria-label": ariaLabel, id, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, }: ComboboxProps): React.JSX.Element;
