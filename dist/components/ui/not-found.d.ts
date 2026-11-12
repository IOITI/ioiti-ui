import { type ElementType, type ReactNode } from "react";
export interface NotFoundSuggestion {
    label: string;
    href: string;
    description?: string;
}
export interface NotFoundProps {
    errorCode?: string;
    badgeLabel?: string;
    title?: string;
    description?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    homeHref?: string;
    homeLabel?: string;
    showBack?: boolean;
    backLabel?: string;
    secondaryActionLabel?: string;
    onBack?: () => void;
    onSecondaryAction?: () => void;
    children?: ReactNode;
    /**
     * The missing path, shown in a small chip. Left undefined it's read from
     * window.location.pathname after mount (the query string is never shown).
     * Pass `null` to hide it.
     */
    path?: string | null;
    /** Up to 3 helpful destinations */
    suggestions?: NotFoundSuggestion[];
    /** Pass next/link (or your router's Link) so navigation stays client-side. ioiti-ui: the application's link (LinkProvider) by default. */
    LinkComponent?: ElementType;
    /** Pointer parallax on the illustration (desktop, default true) */
    parallax?: boolean;
    footer?: ReactNode;
    className?: string;
}
export declare function Illustration({ parallax }: {
    parallax?: boolean;
}): import("react").JSX.Element;
export declare function NotFound({ errorCode, badgeLabel, title, description, actionLabel, onAction, homeHref, homeLabel, showBack, backLabel, secondaryActionLabel, onBack, onSecondaryAction, children, path, suggestions, LinkComponent, parallax, footer, className, }: NotFoundProps): import("react").JSX.Element;
export default NotFound;
