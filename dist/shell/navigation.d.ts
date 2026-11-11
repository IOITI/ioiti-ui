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
/**
 * A section of the menu, said more of than its name: drawn without a heading (`title: false`, a menu's first
 * section often), or folded by the reader (`foldable`: folded until it is unfolded, or until the page shown is in
 * it; each reader's choice is kept by the browser).
 */
export interface MenuSection<S extends string = string> {
    id: S;
    /** Its heading in the sidebar and its step in the trail: its id by default; `false`, none. */
    title?: string | false;
    foldable?: boolean;
}
/** The sections, in the order the sidebar shows them, and the pages under them. */
export interface Menu<S extends string = string> {
    /** Each a name (its heading), or said more of (`MenuSection`). */
    sections: readonly (S | MenuSection<S>)[];
    entries: readonly MenuEntry<S>[];
    /**
     * Whether the trail says the section of a page ("Home › Work › Orders"): yes by default. A menu whose sections
     * only group its entries in the sidebar says no ("Home › Orders").
     */
    trailSections?: boolean;
}
/** The sections of a menu, each said in full. */
export declare function menuSections<S extends string>(menu: Menu<S>): MenuSection<S>[];
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
 * its name. The page at `/` is Home itself: nothing comes after it. No section
 * step for a section without a heading, nor in a menu whose trail says none
 * (`trailSections: false`).
 */
export declare function trailFor(menu: Menu, pathname: string, page?: PageName | null): Crumb[];
/** The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed. */
export declare function sidebarSections(menu: Menu): SidebarSection[];
