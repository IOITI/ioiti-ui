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
}
export declare function Combobox({ options, value, defaultValue, onValueChange, placeholder, searchPlaceholder, emptyText, align, disabled, className, "aria-label": ariaLabel, id, }: ComboboxProps): React.JSX.Element;
