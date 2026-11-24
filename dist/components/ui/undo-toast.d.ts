import React from 'react';
import type { StatusTone } from '../../lib/tones.js';
/**
 * @deprecated Use `StatusTone`, which `tone` takes. Removed in 1.0. ioiti-ui: the values of the former `variant`, read as
 * a tone's (`default` as `neutral`, `error` as `danger`).
 */
export type UndoToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type UndoToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface UndoToastProps {
    /** Visibility state */
    open?: boolean;
    /**
     * Toast message title (e.g. "File deleted"). ioiti-ui: what was done, which only the application knows: without one,
     * "Done" in the provider's language (EasyUI's "Project archived"), and in development the toast says so in the console.
     */
    title?: string;
    /**
     * Secondary description or metadata. ioiti-ui: "Changes will be permanent in a few seconds" in the provider's language
     * by default.
     */
    description?: string;
    /** Undo action button label. ioiti-ui: "Undo" in the provider's language by default. */
    undoLabel?: string;
    /** Restored state message when Undo is triggered. ioiti-ui: "Restored successfully" in the provider's language by default. */
    restoredMessage?: string;
    /** Duration in milliseconds before automatic dismissal */
    duration?: number;
    /**
     * ioiti-ui: what was done, a StatusTone (its icon): `neutral` by default (a bin: a removal), `info`, `success`,
     * `warning`; `danger`, read out at once.
     */
    tone?: StatusTone;
    /**
     * @deprecated Use `tone`. Removed in 1.0. Its values read as a tone's: `default` as `neutral`, `error` as `danger`.
     */
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
