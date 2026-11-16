/** The sections of a menu, each said in full. */
export function menuSections(menu) {
    return menu.sections.map((section) => (typeof section === 'string' ? { id: section } : section));
}
/** The heading of a section, or nothing for a section drawn without one. */
function headingOf(section, id) {
    if (section?.title === false)
        return undefined;
    return section?.title ?? id;
}
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
/** An entry's address, apart: its path, and the values of the query it says (none, most often). */
function addressOf(path) {
    const at = path.indexOf('?');
    if (at < 0)
        return { path: withoutTrailingSlash(path), query: [] };
    return { path: withoutTrailingSlash(path.slice(0, at)), query: [...new URLSearchParams(path.slice(at + 1))] };
}
/** Which of two ranks is the higher: the first value that differs says. */
function outranks(rank, other) {
    const at = rank.findIndex((value, index) => value !== other[index]);
    return at >= 0 && rank[at] > other[at];
}
/**
 * The entry of the menu a page is under: its own, or the one of the page it was reached from
 * (`/orders/42` is under Orders). The longest path wins, for a menu that has `/items` and
 * `/items/archive`; then the entry that says more of the query, whose values the address has (`search`, the
 * address's query: `?tab=open`); then an entry under another over that other, at the same address.
 */
export function menuEntry(menu, pathname, search = '') {
    const path = withoutTrailingSlash(pathname);
    const query = new URLSearchParams(search);
    let found;
    let best = [];
    for (const entry of menu.entries) {
        const address = addressOf(entry.path);
        if (!isUnder(path, address.path))
            continue;
        if (!address.query.every(([key, value]) => query.getAll(key).includes(value)))
            continue;
        const rank = [address.path.length, address.query.length, parentOf(menu, entry) ? 1 : 0];
        if (!found || outranks(rank, best)) {
            found = entry;
            best = rank;
        }
    }
    return found;
}
/**
 * Where a page is, after Home: the section of its entry of the menu (not a
 * link: a section has no page of its own), then the entry; for a page deeper
 * than the menu, the entry becomes a link and the page adds its parents and
 * its name. The page at `/` is Home itself: nothing comes after it. No section
 * step for a section without a heading, nor in a menu whose trail says none
 * (`trailSections: false`), nor for a section at the foot of the sidebar. An entry under another goes through it: a link to
 * its page, unless that page is one of its entries' (it is said, not linked).
 * A deeper page named as the step before it is that step, said once.
 */
export function trailFor(menu, pathname, page, search = '') {
    const entry = menuEntry(menu, pathname, search);
    if (!entry)
        return [{ label: page?.title ?? PAGE_NOT_FOUND }];
    if (entry.path === '/')
        return [];
    const sectionOf = menuSections(menu).find((section) => section.id === entry.section);
    // A section at the foot of the sidebar has no heading there: none in the trail either.
    const heading = menu.trailSections === false || sectionOf?.place === 'footer' ? undefined : headingOf(sectionOf, entry.section);
    const section = heading ? [{ label: heading }] : [];
    // An entry under another goes through it: a page, so a link, unless its page is one of its entries'.
    const parent = parentOf(menu, entry);
    if (parent)
        section.push(ownsItsPage(menu, parent) ? { label: parent.label, href: parent.path } : { label: parent.label });
    if (withoutTrailingSlash(pathname) === addressOf(entry.path).path)
        return [...section, { label: entry.label }];
    const steps = [...section, { label: entry.label, href: entry.path }, ...(page?.parents ?? [])];
    const title = page?.title ?? UNNAMED;
    if (steps.at(-1)?.label === title)
        return [...steps.slice(0, -1), { label: title }];
    return [...steps, { label: title }];
}
/** The entry another is under, when it names one of the same section (a parent has no parent of its own). */
function parentOf(menu, entry) {
    if (entry.parent === undefined)
        return undefined;
    const parent = menu.entries.find((candidate) => candidate.id === entry.parent);
    return parent && parent.section === entry.section && parent.parent === undefined ? parent : undefined;
}
/** Whether a parent's address is a page of its own, not the one of an entry under it (its first page). */
function ownsItsPage(menu, parent) {
    return !menu.entries.some((child) => child.path === parent.path && parentOf(menu, child)?.id === parent.id);
}
/**
 * The menu as the sidebar draws it: each entry a link, which can be opened in another tab as well as followed;
 * the entries under another (`parent`) listed under it; the sections at the foot (`place: 'footer'`) said so.
 */
export function sidebarSections(menu) {
    return menuSections(menu).map((section) => {
        const entries = menu.entries.filter((entry) => entry.section === section.id);
        return {
            id: section.id,
            title: section.place === 'footer' ? undefined : headingOf(section, section.id),
            ...(section.foldable && section.place !== 'footer' ? { foldable: true } : {}),
            ...(section.place === 'footer' ? { place: 'footer' } : {}),
            items: entries
                .filter((entry) => !parentOf(menu, entry))
                .map(({ id, label, icon, badge, badgeTone, path }) => {
                const children = entries
                    .filter((child) => parentOf(menu, child)?.id === id)
                    .map((child) => ({ id: child.id, label: child.label, badge: child.badge, badgeTone: child.badgeTone, href: child.path }));
                return { id, label, icon, badge, badgeTone, href: path, ...(children.length ? { children } : {}) };
            }),
        };
    });
}
