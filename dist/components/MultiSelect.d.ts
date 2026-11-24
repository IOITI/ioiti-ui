export interface MultiSelectOption {
    value: string;
    label: string;
    description?: string;
    /** The group it is listed under. */
    group?: string;
    disabled?: boolean;
}
interface MultiSelectProps {
    options: MultiSelectOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    /** Its name for a screen reader, where no `<label htmlFor>` names it. */
    label?: string;
    /** Its field's id, for a `Field htmlFor`. */
    id?: string;
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
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** What the list says when nothing matches. */
    emptyText?: string;
    className?: string;
}
/**
 * Several values from a list, each a chip in the field: customers, tags, countries. Typing filters the
 * list; the arrows move in it and Enter ticks or unticks; Backspace in an empty field removes the last
 * chip. With `onCreateOption`, what is typed becomes a value of its own (a tag). As Elastic UI's combo box.
 */
export declare function MultiSelect({ options, value, defaultValue, onChange, label, id, placeholder, onCreateOption, maxChips, max, disabled, error, emptyText, className, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, }: MultiSelectProps): import("react").JSX.Element;
export {};
