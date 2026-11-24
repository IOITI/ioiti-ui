import * as React from "react";
export type SidebarBadgeTone = "neutral" | "warning" | "negative";
export type SidebarChild = {
    id: string;
    label: string;
    badge?: string | number;
    badgeTone?: SidebarBadgeTone;
    href?: string;
};
export type SidebarItem = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
    badgeTone?: SidebarBadgeTone;
    children?: SidebarChild[];
    href?: string;
};
export type SidebarSection = {
    id?: string;
    title?: string;
    foldable?: boolean;
    place?: "footer";
    items: SidebarItem[];
};
/** Use inside `header` / `footer` to adapt to the icon-only state. */
export declare const useSidebar: () => {
    collapsed: boolean;
};
export interface SidebarProps {
    sections: SidebarSection[];
    activeId: string;
    /** ioiti-ui: optional; an entry with an `href` leads there by itself. */
    onActiveChange?: (id: string) => void;
    /**
     * ioiti-ui: what draws an entry that has an `href` (the router's link, given `href`); the
     * application's link (LinkProvider) by default, else `a`.
     */
    linkComponent?: React.ElementType;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    /**
     * ioiti-ui: where the browser keeps the reader's choice of the rail (`localStorage`), so that the sidebar opens as
     * it was left; `defaultCollapsed` until a choice is kept. Not kept without it, nor while `collapsed` is given.
     */
    collapsedStorageKey?: string;
    mobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    /**
     * ioiti-ui: the id of the drawer a phone shows, for the control that opens it to name (`aria-controls`, as AppShell's
     * does).
     */
    drawerId?: string;
    className?: string;
}
export declare function Sidebar({ collapsed: collapsedProp, defaultCollapsed, onCollapsedChange, collapsedStorageKey, mobileOpen: mobileProp, onMobileOpenChange, drawerId, className, ...content }: SidebarProps): React.JSX.Element;
/** Put anywhere (e.g. your top bar). Only visible below md. ioiti-ui: named in the provider's language ("Open navigation"). */
export declare function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">): React.JSX.Element;
