import React from 'react';
export type UndoToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type UndoToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface UndoToastProps {
    /** Visibility state */
    open?: boolean;
    /** Toast message title (e.g. "File deleted") */
    title?: string;
    /** Secondary description or metadata */
    description?: string;
    /** Undo action button label */
    undoLabel?: string;
    /** Restored state message when Undo is triggered */
    restoredMessage?: string;
    /** Duration in milliseconds before automatic dismissal */
    duration?: number;
    /** Toast variant visual tone */
    variant?: UndoToastVariant;
    /** Toast screen placement */
    position?: UndoToastPosition;
    /** Callback fired when user clicks Undo */
    onUndo?: () => void;
    /** Callback fired when toast finishes timer or is closed */
    onDismiss?: () => void;
    /** Whether to show the countdown bar */
    showProgress?: boolean;
    /** Custom icon */
    icon?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** ioiti-ui: classes for the positioned wrapper, e.g. to clear a bar fixed at the bottom (as velocity-toast's). */
    wrapperClassName?: string;
}
export declare const UndoToast: React.FC<UndoToastProps>;
