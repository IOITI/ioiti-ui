import type { ComponentProps, ElementType, ReactNode } from 'react';
import type { Menu } from './navigation.js';
export interface AppShellProps<S extends string = string> {
    /** The application's menu: the sidebar lists it, the trail of the top bar says where the page is in it. */
    menu: Menu<S>;
    /** The address of the page shown (the router's: `useLocation().pathname`; RouterAppShell gives it). */
    pathname: string;
    /**
     * The part of the page the address shows (the router's `useLocation().hash`: `#rules`; RouterAppShell gives it):
     * the page scrolls to it once it is there, as the browser does for a page it loads, for a link from another page
     * too (a part the page draws late is waited for, 3 s at most).
     */
    hash?: string;
    /**
     * The address's query (the router's `useLocation().search`: `?tab=open`; RouterAppShell gives it): which entry of
     * the menu the page is, for a menu whose entries say values of the query (a page's tab, `/orders?tab=open`).
     */
    search?: string;
    /** The page. */
    children: ReactNode;
    /** The name at the top of the sidebar; IoitiProvider's `appName` by default. */
    appName?: string;
    /** A line under the name (a version: `v1.2.0`). */
    appDetail?: ReactNode;
    /** The square beside the name; the name's first letter by default. */
    brandMark?: ReactNode;
    /** In place of the name and its mark, at the top of the sidebar. */
    sidebarHeader?: ReactNode;
    /** At the bottom of the sidebar, above its Collapse button: a sign-out (SidebarFooterButton). */
    sidebarFooter?: ReactNode;
    /**
     * States the user must not miss, after the trail: a StateChip each while they are few, or all of them in one
     * StateSummary; nothing takes room while there is none.
     */
    topBarChips?: ReactNode;
    /** The right end of the top bar (search, notifications…): the theme button by default, `null` for nothing. */
    topBarEnd?: ReactNode;
    /** The pages that take the whole width (an editor beside its preview, a chart); the others stop at 80rem. */
    isWide?: (pathname: string) => boolean;
    /**
     * Which page an address shows: the page moves (fades out, the next rising in) only between two, and opens at
     * its top. Addresses of one page change it in place, where it was scrolled: its tabs, a record's sheet over its
     * list (`/rules/:id` is `/rules`), a redirect to its first tab. Each address is a page of its own by default.
     */
    pageOf?: (pathname: string) => string;
    /** The first step of the trail. */
    home?: {
        label: string;
        href: string;
    };
    /** What draws the menu's links; the application's (LinkProvider) by default. */
    linkComponent?: ElementType;
    defaultCollapsed?: boolean;
    /**
     * Where the browser keeps the reader's choice of the folded sidebar (the rail: ⌘B, Collapse), so that every page
     * opens it as it was left (`'app.sidebar.collapsed'`); `defaultCollapsed` until a choice is kept. Not kept without it.
     */
    collapsedStorageKey?: string;
    /**
     * The list of the keyboard shortcuts registered with a description (useShortcut), on `?`; `false` for none.
     * @default true
     */
    shortcutsDialog?: boolean;
    /** Classes of the frame, which fills the window (`h-dvh`); drawn in a box of a page (a demo): `h-full`. */
    className?: string;
    /**
     * Whether its pages name the browser's tab (PageHeader): yes, unless it is drawn inside another shell (a demo in
     * a page, which names the tab itself).
     */
    tabTitle?: boolean;
}
/**
 * The frame of every page: the sidebar (beside the page from md up, a drawer below; ⌘B folds it),
 * the top bar with the trail of where the page is, and the page itself, which scrolls on its own
 * under the top bar. A page names itself with PageHeader.
 */
export declare function AppShell<S extends string = string>(props: AppShellProps<S>): import("react").JSX.Element;
/**
 * The application's name at the top of the sidebar, beside its mark; the mark alone once the sidebar is folded.
 * The mark is in the accent, as a filled button is: its gradient and grain where it has them.
 */
export declare function AppBrand({ name, detail, mark }: {
    name: string;
    detail?: ReactNode;
    mark?: ReactNode;
}): import("react").JSX.Element;
interface SidebarFooterButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
    /** An icon of lucide-react, as an element: `<LogOut />`. */
    icon: ReactNode;
    label: string;
}
/** An action at the bottom of the sidebar (signing out), its icon alone once the sidebar is folded. */
export declare function SidebarFooterButton({ icon, label, className, ...props }: SidebarFooterButtonProps): import("react").JSX.Element;
export {};
