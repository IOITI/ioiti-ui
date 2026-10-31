import { createContext, useContext } from 'react';
export const ToastContext = createContext(null);
export function useToast() {
    const context = useContext(ToastContext);
    if (!context)
        throw new Error('useToast must be used inside <ToastProvider>');
    return context;
}
/**
 * Lifts the toasts above what sits at the bottom of the page (a SaveBar), by its height: each gives its own
 * under its key, 0 once it is gone; the toasts clear the highest.
 */
export const ToastInsetContext = createContext(null);
