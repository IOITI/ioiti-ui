import type { ReactNode } from 'react';
/** What a list or a panel says when it has nothing to show: one line, centred, quiet. */
export declare function EmptyText({ className, children }: {
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
/** What went wrong with an action, where it was asked (under its button): read out at once. */
export declare function ErrorText({ className, children }: {
    className?: string;
    children: ReactNode;
}): import("react").JSX.Element;
