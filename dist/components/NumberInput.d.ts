import type { ReactNode } from 'react';
interface NumberInputProps {
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
    /** The digits after the point it shows once it leaves the field. */
    precision?: number;
    /** A unit before the value, or after it: "€", "ms", "days". */
    prefix?: ReactNode;
    suffix?: ReactNode;
    /** Its name for a screen reader, where no `<label htmlFor>` names it. */
    label?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    /** A value that is wrong: its border in the negative colour. */
    error?: boolean;
    /** The − and + buttons beside it. */
    steppers?: boolean;
    className?: string;
}
/**
 * A number to type, or to change with the arrow keys and the − and + buttons: a limit, a quantity, a delay
 * with its unit. What is typed stays as it is until it leaves the field ("1." on the way to "1.5"); a comma
 * or a point marks the decimals; it keeps to its minimum and maximum. A spin button to a screen reader.
 */
export declare function NumberInput({ value, defaultValue, onChange, min, max, step, integer, precision, prefix, suffix, label, id, name, placeholder, disabled, error, steppers, className, }: NumberInputProps): import("react").JSX.Element;
export {};
