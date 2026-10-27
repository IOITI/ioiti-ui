import type { ReactNode } from 'react';
interface SaveBarProps {
    /** Shown while there is something to save. */
    open: boolean;
    /** What there is to save: "3 unsaved changes". */
    message?: ReactNode;
    onSave: () => void;
    /** Gives up the changes; no Discard button without it. */
    onDiscard?: () => void;
    /** The save is on its way. */
    saving?: boolean;
    /** Why the last save failed. */
    error?: ReactNode;
    saveLabel?: string;
    discardLabel?: string;
    /** Other actions, before Discard and Save. */
    children?: ReactNode;
    /** Its name for a screen reader. */
    label?: string;
    className?: string;
}
/**
 * The bar of unsaved changes, at the bottom of the page while there are any: what there is to save, and
 * Discard and Save. It stays in sight as the page scrolls, the toasts rising above it; a screen reader
 * hears it once when it comes. With `RouterLeaveGuard`, leaving the page asks first. As Elastic UI's
 * bottom bar does.
 */
export declare function SaveBar({ open, message, onSave, onDiscard, saving, error, saveLabel, discardLabel, children, label, className, }: SaveBarProps): import("react").JSX.Element;
export {};
