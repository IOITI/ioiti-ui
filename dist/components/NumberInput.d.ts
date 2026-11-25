import type { ReactNode, Ref } from 'react';
import type { DataAttributes } from '../lib/data-attributes.js';
export interface NumberInputProps extends DataAttributes {
    /** The value; `null` (or `NaN`) for none, an empty field. */
    value?: number | null;
    defaultValue?: number | null;
    /** Each value it holds: `null` once emptied. A value being typed ("1.", "-") is not one yet. */
    onChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    /** What the arrows and the buttons add or take away (ten times with Shift, Page Up and Page Down). */
    step?: number;
    /** Whole numbers only. */
    integer?: boolean;
    /** The digits after the decimal separator it shows once it leaves the field. */
    precision?: number;
    /** A unit before the value, or after it: "€", "ms", "days". */
    prefix?: ReactNode;
    suffix?: ReactNode;
    /** Its name for a screen reader, where no `<label htmlFor>` names it. */
    label?: string;
    /** Its field's id, for a `<label htmlFor>`; in a FormItem, the item's. */
    id?: string;
    /**
     * The name its value is sent under with a form (a hidden input): the number as code writes it ("1234.5"), whatever
     * the locale shows; empty while there is none.
     */
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    /** A value that is wrong: its border in the negative colour. */
    error?: boolean;
    /** Its name, as `label`. */
    'aria-label'?: string;
    /** The id of what names it: a heading, a label elsewhere. A Field's label names it without it. */
    'aria-labelledby'?: string;
    /** Read out with it: what a Field around it says under it (its description, its error). */
    'aria-describedby'?: string;
    /** Marked invalid, as a Field with an error marks it: drawn as `error`. */
    'aria-invalid'?: boolean | 'true' | 'false';
    /** The − and + buttons beside it. */
    steppers?: boolean;
    className?: string;
    /** Its field (the input), to focus it. */
    ref?: Ref<HTMLInputElement>;
}
/**
 * A number to type, or to change with the arrow keys and the − and + buttons: a limit, a quantity, a delay
 * with its unit. What is typed is read as the provider's locale writes a number, and as people type one ("1 234,5" and
 * "1234.5" in French; "1,500" is 1500 in English, "1,5" is 1.5), and stays as it is until it leaves the field ("1." on
 * the way to "1.5"); it is then written in the locale's way, its decimal separator and no groups. It keeps to its
 * minimum and maximum. A spin button to a screen reader.
 */
export declare function NumberInput({ value, defaultValue, onChange, min, max, step, integer, precision, prefix, suffix, label, id, name, placeholder, disabled, error, steppers, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, 'aria-invalid': ariaInvalid, ref, ...rest }: NumberInputProps): import("react").JSX.Element;
