import React from 'react';
import type { StatusTone } from '../../lib/tones.js';
import type { ToastAction } from '../toast-context.js';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface ToastProps {
    open: boolean;
    onDismiss?: () => void;
    title: string;
    description?: string;
    duration?: number;
    /**
     * ioiti-ui: what it says, a StatusTone (its icon): `neutral` by default, `info`, `success`, `warning`; `danger` for what
     * went wrong, read out at once.
     */
    tone?: StatusTone;
    position?: ToastPosition;
    showProgress?: boolean;
    icon?: React.ReactNode;
    className?: string;
    /** ioiti-ui: classes for the positioned wrapper, e.g. to clear a bar fixed at the bottom. */
    wrapperClassName?: string;
    /** ioiti-ui: the positioned wrapper's style: lifted above a bar at the bottom of the page (ToastProvider). */
    wrapperStyle?: React.CSSProperties;
    /** ioiti-ui: once it has left, its exit played: a queue shows the next one then (ToastProvider). */
    onExitComplete?: () => void;
    /**
     * ioiti-ui: one thing to do from the toast, beside its words: a link (`href`) or a button (`onClick`). Using it closes
     * the toast.
     */
    action?: ToastAction;
    /** ioiti-ui: what draws the action's link; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
}
/**
 * Toast — Enters with velocity and settles; the progress bar
 * responds naturally (animates from 100 -> 0 with a slight ease-in so the
 * last 10% feels like the toast is "deciding" to close).
 *
 * On hover the progress pauses; on leave it resumes with no jump. The
 * container slides in with a slightly higher initial velocity (initial y
 * offset 18px) that settles through a snappy spring, giving the toast a
 * feeling of motion.
 *
 * ioiti-ui: EasyUI's VelocityToast, named after its role.
 */
export declare const Toast: React.FC<ToastProps>;
