import type { Dispatch, SetStateAction } from 'react';
import type { Crumb, Menu, PageName } from './navigation.js';
/** A page's name, with the address it was given for. */
export interface Named extends PageName {
    pathname: string;
}
export interface Publisher {
    pathname: string;
    publish: Dispatch<SetStateAction<Named | null>>;
}
/** Where a page gives its name: the shell's (PageTrailProvider). */
export declare const PublisherContext: import("react").Context<Publisher | null>;
/** The name the page shown gave, read by the top bar. */
export declare const NamedContext: import("react").Context<Named | null>;
/** The menu, and the address of the page shown: what the trail is made from. */
export declare const TrailContext: import("react").Context<{
    menu: Menu;
    pathname: string;
} | null>;
/**
 * Gives the trail of the top bar the name of the page and the pages between
 * its entry of the menu and itself. PageHeader does it with its title; outside
 * the shell (the tests of a page alone) it does nothing.
 */
export declare function usePageName(title: string, parents?: Crumb[]): void;
/**
 * The tab says which page it is: several are often open side by side. Its title is the page's,
 * then the application's name when IoitiProvider was given one ("Orders · My App"); a page named
 * as the application (its sign-in page) says the name once.
 */
export declare function useTabTitle(title: string): void;
/** The menu and the address of the page shown; null outside the shell. */
export declare function useTrail(): {
    menu: Menu;
    pathname: string;
} | null;
/** The trail of the page shown, after Home; nothing outside the shell. */
export declare function usePageTrail(): Crumb[];
