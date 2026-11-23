import type { ReactNode } from 'react';
interface EmptyStateProps {
    /** What would be there, as an icon of lucide-react: `<Inbox />`. */
    icon?: ReactNode;
    /** What there is not: "No detection rule yet". */
    title: ReactNode;
    /** The level of its heading, one under what holds it: 2 under the page's (3 when `compact`, under a panel's). */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Why, and what would bring something. */
    description?: ReactNode;
    /** What to do about it: a `Button` for an action, a `ButtonLink` for a page, or a few. */
    actions?: ReactNode;
    /** Smaller and closer: inside a `Panel`, or across the columns of a table's body. */
    compact?: boolean;
    className?: string;
}
/**
 * What a page, a panel or a table says when it has nothing to show, and the way to something: an icon, what
 * there is not under a heading, why, and what to do about it. For one quiet line, `EmptyText`.
 */
export declare function EmptyState({ icon, title, headingLevel, description, actions, compact, className }: EmptyStateProps): import("react").JSX.Element;
export {};
