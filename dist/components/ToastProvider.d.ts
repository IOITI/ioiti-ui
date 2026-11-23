import type { ReactNode } from 'react';
interface ToastProviderProps {
    /**
     * Classes of the toast's frame, to move it: above a bar fixed at the bottom of a page
     * (`bottom-20`), for instance.
     */
    wrapperClassName?: string;
    children: ReactNode;
}
/**
 * Toasts are shown one at a time, each for its full time. Two things happening
 * at once (an action's result and the event it caused) are shown one after the
 * other rather than the second replacing the first.
 *
 * Bottom centre: where pages put no control. Bottom right is where the buttons
 * that save and the paging of tables are; top right, the date ranges and the
 * exports.
 */
export declare function ToastProvider({ wrapperClassName, children }: ToastProviderProps): import("react").JSX.Element;
export {};
