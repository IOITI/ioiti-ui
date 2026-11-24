import React from 'react';
export interface SpringSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    description?: string;
}
export interface SpringSelectProps {
    /** Option list */
    options: SpringSelectOption[];
    /** Currently selected value (controlled) */
    value?: string;
    /** Default selected value (uncontrolled) */
    defaultValue?: string;
    /** Placeholder when no value is selected */
    placeholder?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Visible label */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Custom class name for the root */
    className?: string;
    /** ioiti-ui: the trigger's id, for a `<label htmlFor>` (a `Field htmlFor`). */
    id?: string;
    /** ioiti-ui: the value is sent with the form around it under this name (a hidden input). */
    name?: string;
    /** ioiti-ui: its name, where no `label` is shown. */
    'aria-label'?: string;
    /** ioiti-ui: the id of what names it, in place of its `label`. */
    'aria-labelledby'?: string;
    /** ioiti-ui: read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** ioiti-ui: marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
}
/**
 * SpringSelect — The dropdown menu follows the trigger with a tiny spring.
 * On open, the menu slides down with a slight overshoot; the chevron rotates
 * a hair past 180° before settling. Closing is a smooth ease-back.
 *
 * ioiti-ui: the menu settles without overshoot (springSnappy) and the chevron turns to 180° exactly, as every
 * chevron of the design does.
 *
 * ioiti-ui: a select-only combobox (WAI-ARIA APG): the focus stays on the trigger, whose keys open the list, move in it
 * (the arrows, Home, End, PageUp, PageDown, letters typed) and choose (Enter, Space, Alt+ArrowUp, Tab), the option
 * they are on its `aria-activedescendant`.
 */
export declare const SpringSelect: React.FC<SpringSelectProps>;
