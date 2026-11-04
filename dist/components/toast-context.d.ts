import type { VelocityToastVariant } from './ui/velocity-toast.js';
export interface ToastMessage {
    title: string;
    description?: string;
    variant?: VelocityToastVariant;
}
export type ShowToast = (message: ToastMessage) => void;
export declare const ToastContext: import("react").Context<ShowToast | null>;
export declare function useToast(): ShowToast;
/**
 * Lifts the toasts above what sits at the bottom of the page (a SaveBar), by its height: each gives its own
 * under its key, 0 once it is gone; the toasts clear the highest.
 */
export declare const ToastInsetContext: import("react").Context<((key: string, inset: number) => void) | null>;
