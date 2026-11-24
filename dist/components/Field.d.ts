import type { ReactNode } from 'react';
interface FieldProps {
    label: ReactNode;
    /**
     * What the value is for, or how to write it: under the control, in muted text, read out with it
     * (`aria-describedby`). The label alone names the control.
     */
    description?: ReactNode;
    /**
     * What is wrong with the value, under the control: read out with it (`aria-describedby`), and the control marked
     * invalid (`aria-invalid`), which the package's fields draw in the error's colour.
     */
    error?: ReactNode;
    /**
     * The control's `id`, for a control that must not sit inside its label: a Combobox (a label passes
     * an option's click on to its field). The label is then beside it, and names it by `htmlFor`; the package's
     * Input, Select, Textarea and switches take it without being given it.
     */
    htmlFor?: string;
    className?: string;
    /** The control: an Input, a Select, a Combobox, a Switch… */
    children: ReactNode;
}
/**
 * A control under its label, the label small and semibold; what it is for, and what is wrong, under it, muted, out
 * of the label (which names the control by itself): they describe it, and an error marks it invalid. The package's
 * controls read them wherever they are in it (in a Hint, beside a button); one from elsewhere, which cannot, is
 * given them as props when it is the Field's child.
 */
export declare function Field({ label, description, error, htmlFor, className, children }: FieldProps): import("react").JSX.Element;
export {};
