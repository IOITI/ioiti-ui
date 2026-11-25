import type { ReactNode } from 'react';
/** The props of `EmptyText`. */
export interface EmptyTextProps {
    className?: string;
    /** What it says: "No run yet." */
    children: ReactNode;
}
/** What a list or a panel says when it has nothing to show: one line, centred, quiet. */
export declare function EmptyText({ className, children }: EmptyTextProps): import("react").JSX.Element;
/** The props of `ErrorText`. */
export interface ErrorTextProps {
    className?: string;
    /** What went wrong: "The run could not be stopped." */
    children: ReactNode;
}
/** What went wrong with an action, where it was asked (under its button): read out at once. */
export declare function ErrorText({ className, children }: ErrorTextProps): import("react").JSX.Element;
