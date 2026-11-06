/** The first step of every trail. */
export const DEFAULT_HOME = { label: 'Home', href: '/' };
export const PAGE_NOT_FOUND = 'Page not found';
/** The end of a deeper page's trail until the page has said its name. */
export const UNNAMED = '…';
function withoutTrailingSlash(pathname) {
    return pathname.replace(/\/+$/, '') || '/';
}
function isUnder(path, entryPath) {
    return entryPath === '/' ? path === '/' : path === entryPath || path.startsWith(`${entryPath}/`);
}
/**
 * The entry of the menu a page is under: its own, or the one of the page it was reached from
 * (`/orders/42` is under Orders). The longest path wins, for a menu that has `/items` and
 * `/items/archive`.
 */
export function menuEntry(menu, pathname) {
    const path = withoutTrailingSlash(pathname);
    let found;
    for (const entry of menu.entries) {
        if (isUnder(path, entry.path) && (!found || entry.path.length > found.path.length))
            found = entry;
    }
    return found;
}
/**
 * Where a page is, after Home: the section of its entry of the menu (not a
 * link: a section has no page of its own), then the entry; for a page deeper
 * than the menu, the entry becomes a link and the page adds its parents and
 * its name. The page at `/` is Home itself: nothing comes after it.
 */
export function trailFor(menu, pathname, page) {
    const entry = menuEntry(menu, pathname);
    if (!entry)
        return [{ label: page?.title ?? PAGE_NOT_FOUND }];
    if (entry.path === '/')
        return [];
    if (withoutTrailingSlash(pathname) === entry.path)
        return [{ label: entry.section }, { label: entry.label }];
    return [
        { label: entry.section },
        { label: entry.label, href: entry.path },
        ...(page?.parents ?? []),
        { label: page?.title ?? UNNAMED },
    ];
}
/** The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed. */
export function sidebarSections(menu) {
    return menu.sections.map((title) => ({
        title,
        items: menu.entries
            .filter((entry) => entry.section === title)
            .map(({ id, label, icon, badge, path }) => ({ id, label, icon, badge, href: path })),
    }));
}
