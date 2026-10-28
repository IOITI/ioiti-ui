import type { ReactNode } from 'react';
import type { SidebarSection } from '../components/ui/sidebar.js';
/**
 * The menu of an application, and where each page stands in it: the sidebar
 * lists it, and the trail of the top bar says it, from this one table.
 */
/** A page of the menu, under its section. */
export interface MenuEntry<S extends string = string> {
    id: string;
    path: string;
    label: string;
    section: S;
    /** An icon of lucide-react, as an element: `<LayoutDashboard />`. */
    icon?: ReactNode;
    badge?: string | number;
}
/** The sections, in the order the sidebar shows them, and the pages under them. */
export interface Menu<S extends string = string> {
    sections: readonly S[];
    entries: readonly MenuEntry<S>[];
}
/** A step of a trail: a link unless it is the page shown, or a section, which has no page. */
export interface Crumb {
    label: string;
    href?: string;
}
/**
 * What a page deeper than the menu says of itself (its PageHeader does): its
 * name, and the pages between its entry of the menu and itself.
 */
export interface PageName {
    title: string;
    parents?: Crumb[];
}
/** The first step of every trail. */
export declare const DEFAULT_HOME: {
    label: string;
    href: string;
};
export declare const PAGE_NOT_FOUND = "Page not found";
/** The end of a deeper page's trail until the page has said its name. */
export declare const UNNAMED = "\u2026";
/**
 * The entry of the menu a page is under: its own, or the one of the page it was reached from
 * (`/orders/42` is under Orders). The longest path wins, for a menu that has `/items` and
 * `/items/archive`.
 */
export declare function menuEntry<S extends string>(menu: Menu<S>, pathname: string): MenuEntry<S> | undefined;
/**
 * Where a page is, after Home: the section of its entry of the menu (not a
 * link: a section has no page of its own), then the entry; for a page deeper
 * than the menu, the entry becomes a link and the page adds its parents and
 * its name. The page at `/` is Home itself: nothing comes after it.
 */
export declare function trailFor(menu: Menu, pathname: string, page?: PageName | null): Crumb[];
/** The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed. */
export declare function sidebarSections(menu: Menu): SidebarSection[];
