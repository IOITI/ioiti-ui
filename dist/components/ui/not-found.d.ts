import { type ElementType, type ReactNode } from "react";
export interface NotFoundSuggestion {
    label: string;
    href: string;
    description?: string;
}
export interface NotFoundProps {
    errorCode?: string;
    /** ioiti-ui: above the heading; "Error 404", in the provider's language, by default. */
    badgeLabel?: string;
    /** ioiti-ui: the heading; the provider's language's by default ("This page took a wrong turn."). */
    title?: string;
    /** ioiti-ui: under the heading; the provider's language's by default ("The requested page doesn't exist or may have moved."). */
    description?: ReactNode;
    /** ioiti-ui: the words of the way home ("Go back home", in the provider's language, by default), `homeLabel`'s too. */
    actionLabel?: string;
    onAction?: () => void;
    homeHref?: string;
    homeLabel?: string;
    showBack?: boolean;
    /** ioiti-ui: the words of the way back ("Go back", in the provider's language, by default), `secondaryActionLabel`'s too. */
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
    /**
     * ioiti-ui: its heading takes the focus as it appears, so that a screen reader says the page is none: right for a
     * page that replaces the page (the router's catch-all, a record the server does not have), wrong for one drawn in
     * a part of a page (a tab, a sheet), where the focus is someone else's. `true` by default.
     */
    focusOnMount?: boolean;
}
export declare function Illustration({ parallax }: {
    parallax?: boolean;
}): import("react").JSX.Element;
export declare function NotFound({ errorCode, badgeLabel, title: givenTitle, description: givenDescription, actionLabel, onAction, homeHref, homeLabel, showBack, backLabel, secondaryActionLabel, onBack, onSecondaryAction, children, path, suggestions, LinkComponent, parallax, focusOnMount, footer, className, }: NotFoundProps): import("react").JSX.Element;
export default NotFound;
