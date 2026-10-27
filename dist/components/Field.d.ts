import type { ReactNode } from 'react';
interface FieldProps {
    label: ReactNode;
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
/** A control under its label, the label in small secondary text. */
export declare function Field({ label, error, htmlFor, className, children }: FieldProps): import("react").JSX.Element;
export {};
