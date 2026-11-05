import React from 'react';
export type VelocityToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type VelocityToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface VelocityToastProps {
    open: boolean;
    onDismiss?: () => void;
    title: string;
    description?: string;
    duration?: number;
    variant?: VelocityToastVariant;
    position?: VelocityToastPosition;
    showProgress?: boolean;
    icon?: React.ReactNode;
    className?: string;
    /** ioiti-ui: classes for the positioned wrapper, e.g. to clear a bar fixed at the bottom. */
    wrapperClassName?: string;
    /** ioiti-ui: the positioned wrapper's style: lifted above a bar at the bottom of the page (ToastProvider). */
    wrapperStyle?: React.CSSProperties;
    /** ioiti-ui: once it has left, its exit played: a queue shows the next one then (ToastProvider). */
    onExitComplete?: () => void;
}
/**
 * VelocityToast — Enters with velocity and settles; the progress bar
 * responds naturally (animates from 100 -> 0 with a slight ease-in so the
 * last 10% feels like the toast is "deciding" to close).
 *
 * On hover the progress pauses; on leave it resumes with no jump. The
 * container slides in with a slightly higher initial velocity (initial y
 * offset 18px) that settles through a snappy spring, giving the toast a
 * feeling of motion.
 */
export declare const VelocityToast: React.FC<VelocityToastProps>;
