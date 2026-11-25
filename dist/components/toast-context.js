import { createContext, useContext } from 'react';
import { deprecated } from '../lib/deprecated.js';
export const ToastContext = createContext(null);
export function useToast() {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error('useToast must be used inside <ToastProvider>');
    return context;
}
/**
 * A toast's tone: the one given, else its former `variant` read as one (`default` as `neutral`, `error` as `danger`),
 * `neutral` without either. A `variant` given is said once, in development (`where`: what was given it).
 */
export function toastTone(tone, variant, where) {
    if (variant !== undefined)
        deprecated('toast-variant', where);
    if (tone !== undefined)
        return tone;
    if (variant === 'default')
        return 'neutral';
    if (variant === 'error')
        return 'danger';
    return variant ?? 'neutral';
}
/**
 * Lifts the toasts above what sits at the bottom of the page (a SaveBar), by its height: each gives its own
 * under its key, 0 once it is gone; the toasts clear the highest.
 */
export const ToastInsetContext = createContext(null);
/**
 * Whether a toast is drawn in ToastProvider's live regions, there from the start, which say it: it is no live region of
 * its own then (a region in a region is said twice).
 */
export const ToastRegionContext = createContext(false);
