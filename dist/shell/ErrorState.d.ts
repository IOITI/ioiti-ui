import type { ReactNode } from 'react';
import type { Crumb } from './navigation.js';
export interface ErrorStateProps {
    /** The heading, what failed ("The orders could not be loaded"); by default, words for the kind of error. */
    title?: string;
    /** What happened, and what to do about it; by default, words for the kind of error. */
    description?: ReactNode;
    /**
     * What was thrown or caught. Its kind chooses the words and the way out (a part of the application that failed to
     * load is reloaded, not tried again); in development, its message and stack are under "Details".
     */
    error?: unknown;
    /** What tries again (a request made again, a boundary's `reset`): a "Try again" button; none without it. */
    onRetry?: () => void;
    /** Trying again, under way: its button busy, and no second press. */
    retrying?: boolean;
    /** The way home, a link; `null` for none (a part of a page has none by default). */
    home?: {
        href: string;
        label: string;
    } | null;
    /**
     * A page (the default): it names the top bar's trail and the browser's tab, its heading is the page's (level 1),
     * and takes the focus as it appears. `false`: a part of a page (a panel's content), smaller, naming nothing, said
     * to a screen reader where the focus is.
     */
    page?: boolean;
    /** What the trail and the tab call the page, the heading by default (a page only). */
    name?: string;
    /** The pages between its entry of the menu and itself, as PageHeader takes them (a page only). */
    parents?: Crumb[];
    /**
     * Its heading takes the focus as it appears: a page's does (but in a shell drawn in a part of a page, which names no
     * tab), a part's does not.
     */
    focusOnMount?: boolean;
    /** The level of its heading: 1 for a page, 3 for a part (under a panel's) by default. */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /** In place of the kind's icon, in the neutral tone: a lock for a page the person may not see. */
    icon?: ReactNode;
    className?: string;
}
/**
 * What a page, or a part of one, shows in place of itself when it failed: what went wrong, in words for its kind,
 * and the way on (try again, reload, home). AppShell shows it for a page that throws, the shell kept; ErrorBoundary
 * for a part; RouterErrorPage for a route that failed to load. For an address that names nothing, NotFoundState.
 */
export declare function ErrorState(props: ErrorStateProps): import("react").JSX.Element;
