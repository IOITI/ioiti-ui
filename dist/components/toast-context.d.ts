import type { VelocityToastVariant } from './ui/velocity-toast.js';
export interface ToastMessage {
    title: string;
    description?: string;
    variant?: VelocityToastVariant;
}
export type ShowToast = (message: ToastMessage) => void;
export declare const ToastContext: import("react").Context<ShowToast | null>;
export declare function useToast(): ShowToast;
