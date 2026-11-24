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
    /** ioiti-ui: told of the value chosen, as every control of the package is (`onChange`). */
    onChange?: (value: string | null) => void;
    /** @deprecated Use `onChange`. Removed in 1.0. */
    onValueChange?: (value: string | null) => void;
    /** ioiti-ui: what it says while nothing is chosen; the provider's language's by default ("Select…"). */
    placeholder?: string;
    /** ioiti-ui: its search's placeholder; the provider's language's by default ("Search…"). */
    searchPlaceholder?: string;
    /** ioiti-ui: what its list says when its search finds nothing; the provider's language's by default ("No results."). */
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
export declare function Combobox({ options, value, defaultValue, onChange, onValueChange, placeholder: givenPlaceholder, searchPlaceholder: givenSearchPlaceholder, emptyText: givenEmptyText, align, disabled, className, "aria-label": ariaLabel, id, "aria-labelledby": labelledBy, "aria-describedby": describedBy, "aria-invalid": ariaInvalid, error, }: ComboboxProps): React.JSX.Element;
