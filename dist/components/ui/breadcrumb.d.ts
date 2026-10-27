import * as React from "react";
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}
export interface BreadcrumbProps extends Omit<React.ComponentProps<"nav">, "children"> {
    items: BreadcrumbItem[];
    separator?: "chevron" | "slash";
    /** Collapse the middle into "…" when there are more items than this. */
    maxItems?: number;
    /** Your router's link, e.g. next/link. ioiti-ui: the application's link (LinkProvider) by default, else <a>. */
    as?: React.ElementType;
    /**
     * ioiti-ui: false keeps the trail on one line (the top bar), each crumb cut
     * short with an ellipsis, the last one first, instead of going to a second line.
     */
    wrap?: boolean;
}
export declare function Breadcrumb({ items, separator, maxItems, as, wrap, className, ...props }: BreadcrumbProps): React.JSX.Element;
