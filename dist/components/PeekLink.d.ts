import type { ReactNode } from 'react';
interface PeekLinkProps {
    to: string;
    /** What the card shows, read once it opens. */
    content: () => ReactNode;
    className?: string;
    children: ReactNode;
    /** False: a tap follows the link at once, the card being for a pointer and the keyboard only. */
    openOnTap?: boolean;
    'aria-label'?: string;
}
/**
 * A link whose page is previewed on hover, on keyboard focus and on a first tap: what it leads to,
 * without leaving the page. It stays a link, which a click (and a second tap) follows.
 */
export declare function PeekLink({ to, content, className, children, openOnTap, 'aria-label': label }: PeekLinkProps): import("react").JSX.Element;
export {};
