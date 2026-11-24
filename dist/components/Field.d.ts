import type { ReactNode } from 'react';
interface FieldProps {
    label: ReactNode;
    /**
     * What the value is for, or how to write it: under the control, in muted text, read out with it
     * (`aria-describedby`, when the control is one element). The label alone names the control then; the error
     * describes it too.
     */
    description?: ReactNode;
    /** What is wrong with the value, under the control. */
    error?: ReactNode;
    /**
     * The control's `id`, for a control that must not sit inside its label: a Combobox (a label passes
     * an option's click on to its field). The label is then beside it, and names it by `htmlFor`.
     */
    htmlFor?: string;
    className?: string;
    /** The control: an Input, a Select, a Combobox… */
    children: ReactNode;
}
/** A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted. */
export declare function Field({ label, description, error, htmlFor, className, children }: FieldProps): import("react").JSX.Element;
export {};
