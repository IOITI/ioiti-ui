import { createContext, useContext, useEffect, useLayoutEffect } from 'react';
import { useAppName } from '../components/app-context.js';
import { trailFor } from './navigation.js';
/** Where a page gives its name: the shell's (PageTrailProvider). */
export const PublisherContext = createContext(null);
/** The name the page shown gave, read by the top bar. */
export const NamedContext = createContext(null);
/** The menu, and the address of the page shown: what the trail is made from. */
export const TrailContext = createContext(null);
/**
 * Gives the trail of the top bar the name of the page and the pages between
 * its entry of the menu and itself. PageHeader does it with its title; outside
 * the shell (the tests of a page alone) it does nothing.
 */
export function usePageName(title, parents) {
    const publisher = useContext(PublisherContext);
    // Compared by value: a page builds its parents again at each render.
    const parentsKey = JSON.stringify(parents ?? []);
    // Before the page is painted, or its trail would show "…" for a frame.
    useLayoutEffect(() => {
        if (!publisher)
            return;
        const named = { pathname: publisher.pathname, title, parents: JSON.parse(parentsKey) };
        publisher.publish(named);
        return () => publisher.publish((current) => (current === named ? null : current));
    }, [publisher, title, parentsKey]);
}
/**
 * The tab says which page it is: several are often open side by side. Its title is the page's,
 * then the application's name when IoitiProvider was given one ("Orders · My App"); a page named
 * as the application (its sign-in page) says the name once.
 */
export function useTabTitle(title) {
    const appName = useAppName();
    useEffect(() => {
        const before = document.title;
        document.title = appName && appName !== title ? `${title} · ${appName}` : title;
        return () => {
            document.title = appName ?? before;
        };
    }, [title, appName]);
}
/** The menu and the address of the page shown; null outside the shell. */
export function useTrail() {
    return useContext(TrailContext);
}
/** The trail of the page shown, after Home; nothing outside the shell. */
export function usePageTrail() {
    const trail = useContext(TrailContext);
    const named = useContext(NamedContext);
    return trail ? trailFor(trail.menu, trail.pathname, named) : [];
}
