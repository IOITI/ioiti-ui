import type { ReactNode } from 'react';
/** The props of `ConfirmAction`. */
export interface ConfirmActionProps {
    /** Open, held by the page (told of each change by `onOpenChange`, of its closing by `onClose`). */
    open?: boolean;
    /** Open at first, the dialog holding it then (Cancel and Escape close it); closed by default. */
    defaultOpen?: boolean;
    /** Told of every change, whoever holds it: `false` when Cancel, Escape, its backdrop or its × closes it. */
    onOpenChange?: (open: boolean) => void;
    title: string;
    /** Exactly what will happen, in the user's terms. */
    description: ReactNode;
    /** Text on the slider, e.g. "Slide to send"; with `gesture="button"`, the text of the button. */
    confirmLabel: string;
    /** What is at stake, said first ("This sends the order to the live account."). Nothing by default. */
    warning?: ReactNode;
    /**
     * How it is confirmed. The slide is for what puts something at risk or cannot be
     * taken back. A plain button is for the protective direction (pausing), which
     * has to be quick: `confirmLabel` is then the text of that button.
     */
    gesture?: 'slide' | 'button';
    /** Shown on the slider once it is done ("Saved", "Sent"...): "Done" in the provider's language by default. */
    doneLabel?: string;
    /** Shown on the slider while the action is under way: "Working…" in the provider's language by default. */
    workingLabel?: string;
    /** The button that closes it: "Cancel" in the provider's language by default. */
    cancelLabel?: string;
    pending?: boolean;
    /** The gesture waits for something the description asks first (a box ticked). */
    blocked?: boolean;
    error?: string | null;
    onConfirm: () => void;
    /** Told when Cancel, Escape, its backdrop or its × closes it (never while `pending`). */
    onClose?: () => void;
}
/**
 * The last step before an action that matters. The user reads what is about
 * to happen, then has to drag the slider to the end (with a keyboard: focus it
 * and press Enter): a deliberate gesture, not a button under the cursor.
 */
export declare function ConfirmAction({ open, defaultOpen, onOpenChange, title, description, confirmLabel, warning, gesture, doneLabel, workingLabel, cancelLabel, pending, blocked, error, onConfirm, onClose, }: ConfirmActionProps): import("react").JSX.Element;
