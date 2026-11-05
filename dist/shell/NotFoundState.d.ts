import type { ReactNode } from 'react';
import type { NotFoundSuggestion } from '../components/ui/not-found.js';
import type { Crumb } from './navigation.js';
export interface NotFoundStateProps {
    /** The heading. */
    title: string;
    description: ReactNode;
    /** What the trail of the top bar and the tab call the page: the heading, unless said otherwise. */
    name?: string;
    /** The pages between its entry of the menu and itself, as PageHeader takes them. */
    parents?: Crumb[];
    /** Up to three pages that may be what was looked for. */
    suggestions?: NotFoundSuggestion[];
    /** The address shown: the shell's by default, else the window's. */
    pathname?: string;
    /** The way home, a link; `null` for none. */
    home?: {
        href: string;
        label: string;
    } | null;
    /** The way back, a step back in this tab's history; `null` for none. */
    back?: {
        label: string;
    } | null;
}
/**
 * What a page shows when its address names nothing: the router's catch-all, or
 * a page whose record the server does not have (its 404). EasyUI's 404, named
 * in the trail and the tab as any page is, with the way home and back.
 */
export declare function NotFoundState({ title, description, name, parents, suggestions, pathname, home, back }: NotFoundStateProps): import("react").JSX.Element;
/**
 * The page of an address that is no page (the router's catch-all, `path: '*'`). An address under
 * an entry of the menu that leads nowhere (an old link, a typo) suggests that entry.
 */
export declare function NotFoundPage({ title, description, ...props }: Partial<NotFoundStateProps>): import("react").JSX.Element;
