import type { ReactNode } from 'react';
interface RouterLeaveGuardProps {
    /** Whether leaving the page would lose something: changes not saved. */
    when: boolean;
    /**
     * The address under which the changes are kept, the page's own views (`/settings` for `/settings/mail`
     * and `/settings/billing`, which share one draft): going from one to another is no leaving.
     */
    within?: string;
    /**
     * An address the page may go to without asking, whatever is lost: the sign-in page a lapsed session is
     * sent to, where staying would save nothing.
     */
    allowed?: (pathname: string) => boolean;
    /** The dialog's question; the provider's language's by default ("Leave without saving?"). */
    title?: string;
    /** What is lost; the provider's language's by default ("The changes on this page are not saved: leaving it loses them."). */
    message?: ReactNode;
    /** The button that stays; the provider's language's by default ("Stay"). */
    stayLabel?: string;
    /** The button that leaves; the provider's language's by default ("Leave"). */
    leaveLabel?: string;
}
/**
 * Asks before the page is left with changes not saved: another page of the application (a dialog, Stay or
 * Leave), or the browser's tab closed or reloaded (the browser's own question). Beside a `SaveBar`, with the
 * same `when`. Needs a data router (`createBrowserRouter`), whose navigations can wait.
 */
export declare function RouterLeaveGuard({ when, within, allowed, title, message, stayLabel, leaveLabel }: RouterLeaveGuardProps): import("react").JSX.Element | null;
export {};
