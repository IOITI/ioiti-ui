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
 * ioiti-ui: one calm entrance, the design's: the panel grows from what opened
 * it (0.96 to 1, 6 px of travel, springGentle), without EasyUI's overshoot
 * (0.94 -> 1.02 -> 1), and its content with it rather than a layer after it.
 * It leaves quicker than it came (easeExit).
 *
 * ioiti-ui: rendered in document.body, so that it takes nothing from the element
 * that opens it (a table cell passes its alignment and wrapping on to what is
 * inside it). Keyboard focus moves into the dialog when it opens, stays in it,
 * and goes back to where it was when it closes.
 */
export declare const SettleModal: React.FC<SettleModalProps>;
