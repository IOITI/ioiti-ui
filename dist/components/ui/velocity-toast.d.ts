import React from 'react';
import type { StatusTone } from '../../lib/tones.js';
import type { ToastAction } from '../toast-context.js';
/**
 * @deprecated Use `StatusTone`, which `tone` takes. Removed in 1.0. ioiti-ui: the values of the former `variant`, read as
 * a tone's (`default` as `neutral`, `error` as `danger`).
 */
export type VelocityToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
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
    /**
     * @deprecated Use `tone`. Removed in 1.0. Its values read as a tone's: `default` as `neutral`, `error` as `danger`.
     */
    variant?: VelocityToastVariant;
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
/** @deprecated Use `Toast`. Removed in 1.0. */
export declare const VelocityToast: React.FC<ToastProps>;
/** @deprecated Use `ToastProps`. Removed in 1.0. */
export type VelocityToastProps = ToastProps;
/** @deprecated Use `ToastPosition`. Removed in 1.0. */
export type VelocityToastPosition = ToastPosition;
/** @deprecated Use `ToastAction`, what useToast() is given too. Removed in 1.0. */
export type VelocityToastAction = ToastAction;
