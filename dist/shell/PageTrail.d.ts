import type { ReactNode } from 'react';
import type { Menu } from './navigation.js';
/**
 * Keeps the name the page shown gives itself (usePageName), for the trail of
 * the top bar. A name is kept with its address and only read for it: the page
 * left behind takes its name away after the next page is drawn, never before.
 */
export declare function PageTrailProvider({ menu, pathname, children }: {
    menu: Menu;
    pathname: string;
    children: ReactNode;
}): import("react").JSX.Element;
/**
 * The trail in the top bar: whole on a wide screen. Narrower, beside the
 * sidebar, its last two steps. On a phone, where the top bar has room for a
 * word or two, the step before the page alone (a link back when it is one):
 * the page's own name is its heading, just under.
 */
export declare function TopBarTrail({ home }: {
    home?: {
        label: string;
        href: string;
    };
}): import("react").JSX.Element;
