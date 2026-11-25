import type { Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
export interface MultiSelectOption {
    value: string;
    label: string;
    description?: string;
    /** The group it is listed under. */
    group?: string;
    disabled?: boolean;
}
export interface MultiSelectProps extends DataAttributes {
    options: MultiSelectOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    /** Its name for a screen reader, where no `<label htmlFor>` names it. */
    label?: string;
    /** Its field's id (the input's), for a `Field htmlFor`; in a FormItem, the item's. */
    id?: string;
    /**
     * The name its values are sent under with a form: one each, in the order chosen, a hidden input each with this name;
     * none while nothing is chosen.
     */
    name?: string;
    /** What it says while nothing is chosen; the provider's language's by default ("Choose…"). */
    placeholder?: string;
    /**
     * What is typed may become a value of its own (a tag): given the text, it gives the option made, or its
     * value. Without it, only the options can be chosen.
     */
    onCreateOption?: (text: string) => MultiSelectOption | string | void;
    /** Chips shown before "+N" says how many more. */
    maxChips?: number;
    /** At most this many values: past it, the options not chosen cannot be, and the list says why. */
    max?: number;
    disabled?: boolean;
    error?: boolean;
    /** Its name, as `label`. */
    'aria-label'?: string;
    /** The id of what names it (and its list): a heading, a label elsewhere. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** What the list says when nothing matches; the provider's language's by default ("Nothing matches"). */
    emptyText?: string;
    className?: string;
    /** Its field (the input typed into, among the chips), to focus it. */
    ref?: Ref<HTMLInputElement>;
}
/**
 * Several values from a list, each a chip in the field: customers, tags, countries. Typing filters the
 * list; the arrows move in it and Enter ticks or unticks; Backspace in an empty field removes the last
 * chip. With `onCreateOption`, what is typed becomes a value of its own (a tag). As Elastic UI's combo box. Its words
 * are the provider's language's, its own props given over them.
 */
export declare function MultiSelect({ options, value, defaultValue, onChange, label, id, name, placeholder, onCreateOption, maxChips, max, disabled, error, emptyText, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }: MultiSelectProps): import("react").JSX.Element;
