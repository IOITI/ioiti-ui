import React from 'react';
export interface SettleModalProps {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    /** Footer area (typically action buttons) */
    footer?: React.ReactNode;
    /** Hide the close (X) button in the top-right */
    hideCloseButton?: boolean;
    /** Click on backdrop closes the modal (default true) */
    closeOnBackdrop?: boolean;
    /**
     * Maximum width of the modal (Tailwind class). ioiti-ui: `xl` for a form with rows of fields, `full` for
     * what is read side by side (two versions of a script).
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}
/**
 * SettleModal — Content has a tiny scale + settle instead of a generic fade.
 *
 * The panel scales from 0.94 -> 1.02 -> 1.0 (with a slight y travel), then the
 * inner content crossfades in with a tiny 0.96 -> 1.0 scale-up, so the
 * perceived motion is "settle" rather than "fade in".
 *
 * ioiti-ui: rendered in document.body, so that it takes nothing from the element
 * that opens it (a table cell passes its alignment and wrapping on to what is
 * inside it). Keyboard focus moves into the dialog when it opens, stays in it,
 * and goes back to where it was when it closes.
 */
export declare const SettleModal: React.FC<SettleModalProps>;
