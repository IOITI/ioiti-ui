import type { ReactNode } from 'react';
import type { SidebarBadgeTone, SidebarSection } from '../components/ui/sidebar.js';
import type { Messages } from '../locales/en.js';
/**
 * The menu of an application, and where each page stands in it: the sidebar
 * lists it, and the trail of the top bar says it, from this one table.
 */
/** A page of the menu, under its section. */
export interface MenuEntry<S extends string = string> {
    id: string;
    /**
     * Its address, and the pages deeper than it (`/orders/42` is under `/orders`). It may say values of the query
     * (`/orders?tab=open`): a tab of a page kept in the query, which is this entry's page only with those values.
     */
    path: string;
    label: string;
    section: S;
    /** An icon of lucide-react, as an element: `<LayoutDashboard />`. */
    icon?: ReactNode;
    /** A count ("38") or a state in a word ("Degraded", "2 open"), after its label. */
    badge?: string | number;
    /** The badge's tone, for a state: `warning` or `danger`, in its colour with a dot; a count stays neutral. */
    badgeTone?: SidebarBadgeTone;
    /**
     * The entry this one is under (its `id`), in the same section: the sidebar lists it under its parent, which
     * opens on its pages and is a page itself, and the trail goes through the parent ("Home › Work › Orders ›
     * Returns"). One level: a parent has no parent.
     *
     * An entry may have its parent's address: it is the parent's first page, the one its address shows ("Rules ›
     * Library", both `/rules`). The parent leads there, and the trail says it without a link of its own.
     */
    parent?: string;
}
/**
 * A section of the menu, said more of than its name: drawn without a heading (`title: false`, a menu's first
 * section often), or folded by the reader (`foldable`: folded until it is unfolded, or until the page shown is in
 * it; each reader's choice is kept by the browser), or at the foot of the sidebar (`place: 'footer'`).
 */
export interface MenuSection<S extends string = string> {
    id: S;
    /** Its heading in the sidebar and its step in the trail: its id by default; `false`, none. */
    title?: string | false;
    foldable?: boolean;
    /**
     * `'footer'`: drawn at the foot of the sidebar, above its Collapse button (pages one goes to now and then: the
     * documentation), without its heading. In the list of pages by default.
     */
    place?: 'footer';
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
/** The end of a deeper page's trail until the page has said its name. */
export declare const UNNAMED = "\u2026";
/**
 * The entry of the menu a page is under: its own, or the one of the page it was reached from
 * (`/orders/42` is under Orders). The longest path wins, for a menu that has `/items` and
 * `/items/archive`; then the entry that says more of the query, whose values the address has (`search`, the
 * address's query: `?tab=open`); then an entry under another over that other, at the same address.
 */
export declare function menuEntry<S extends string>(menu: Menu<S>, pathname: string, search?: string): MenuEntry<S> | undefined;
/** The words of a trail: a catalogue's (`useMessages().shell`), English's by default. */
export type TrailWords = Pick<Messages['shell'], 'pageNotFound'>;
/**
 * Where a page is, after Home: the section of its entry of the menu (not a
 * link: a section has no page of its own), then the entry; for a page deeper
 * than the menu, the entry becomes a link and the page adds its parents and
 * its name. The page at `/` is Home itself: nothing comes after it. No section
 * step for a section without a heading, nor in a menu whose trail says none
 * (`trailSections: false`), nor for a section at the foot of the sidebar. An entry under another goes through it: a link to
 * its page, unless that page is one of its entries' (it is said, not linked).
 * A deeper page named as the step before it is that step, said once. An address that is no page is "Page not found", in
 * the words given (English's by default), until the page names itself.
 */
export declare function trailFor(menu: Menu, pathname: string, page?: PageName | null, search?: string, words?: TrailWords): Crumb[];
/**
 * The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed;
 * the entries under another (`parent`) listed under it; the sections at the foot (`place: 'footer'`) said so.
 */
export declare function sidebarSections(menu: Menu): SidebarSection[];
