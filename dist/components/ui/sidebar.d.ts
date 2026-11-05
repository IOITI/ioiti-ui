import * as React from "react";
export type SidebarChild = {
    id: string;
    label: string;
    badge?: string | number;
    href?: string;
};
export type SidebarItem = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
    children?: SidebarChild[];
    href?: string;
};
export type SidebarSection = {
    title?: string;
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
    mobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    className?: string;
}
export declare function Sidebar({ collapsed: collapsedProp, defaultCollapsed, onCollapsedChange, mobileOpen: mobileProp, onMobileOpenChange, className, ...content }: SidebarProps): React.JSX.Element;
/** Put anywhere (e.g. your top bar). Only visible below md. */
export declare function SidebarTrigger({ className, ...props }: React.ComponentProps<"button">): React.JSX.Element;
