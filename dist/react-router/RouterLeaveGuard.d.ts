import type { ReactNode } from 'react';
interface RouterLeaveGuardProps {
    /** Whether leaving the page would lose something: changes not saved. */
    when: boolean;
    title?: string;
    message?: ReactNode;
    stayLabel?: string;
    leaveLabel?: string;
}
/**
 * Asks before the page is left with changes not saved: another page of the application (a dialog, Stay or
 * Leave), or the browser's tab closed or reloaded (the browser's own question). Beside a `SaveBar`, with the
 * same `when`. Needs a data router (`createBrowserRouter`), whose navigations can wait.
 */
export declare function RouterLeaveGuard({ when, title, message, stayLabel, leaveLabel, }: RouterLeaveGuardProps): import("react").JSX.Element | null;
export {};
