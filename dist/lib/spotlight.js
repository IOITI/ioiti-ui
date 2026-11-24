// What SpotlightSearch keeps between its openings: the entries chosen last (`remember`), in this browser, under the
// application's key; and how it finds an entry again among its own, in the lists of its entries too.
import { keep, readKept, unkeep } from './kept.js';
import { themeStorageKey } from './theme.js';
/** How many entries chosen are kept, the latest first. */
export const REMEMBERED = 5;
/** Where a list of entries chosen is kept: under the application's key (`themeStorageKey()`), `.spotlight.<name>`. */
export function rememberedKey(list) {
    return `${themeStorageKey()}.spotlight.${list}`;
}
const isText = (value) => typeof value === 'string';
/** An entry as it was kept, or undefined: what is kept there is no entry (another version, another hand). */
function entryOf(value) {
    if (!value || typeof value !== 'object')
        return undefined;
    const { id, title, category, href } = value;
    if (!isText(id) || !isText(title) || !isText(category) || (href !== undefined && !isText(href)))
        return undefined;
    return href === undefined ? { id, title, category } : { id, title, category, href };
}
/** The entries kept under a key, the latest first: none where nothing is, or what is is not a list of entries. */
export function readRemembered(key) {
    const kept = readKept(key);
    if (!kept)
        return [];
    try {
        const value = JSON.parse(kept);
        if (!Array.isArray(value))
            return [];
        const entries = [];
        for (const each of value) {
            const entry = entryOf(each);
            if (entry && !entries.some((other) => other.id === entry.id))
                entries.push(entry);
        }
        return entries.slice(0, REMEMBERED);
    }
    catch {
        return [];
    }
}
/** An entry chosen, kept first (once), the oldest beyond five forgotten: the list now kept. */
export function rememberEntry(key, entry) {
    const kept = entryOf(entry);
    if (!kept)
        return readRemembered(key);
    const entries = [kept, ...readRemembered(key).filter((other) => other.id !== kept.id)].slice(0, REMEMBERED);
    keep(key, JSON.stringify(entries));
    return entries;
}
/** An entry forgotten: the list now kept (none kept once it is empty). */
export function forgetEntry(key, id) {
    const entries = readRemembered(key).filter((entry) => entry.id !== id);
    if (entries.length === 0)
        unkeep(key);
    else
        keep(key, JSON.stringify(entries));
    return entries;
}
/** An entry by its id, among the entries and the lists of their entries (`items`), the first found. */
export function findEntry(entries, id) {
    for (const entry of entries) {
        if (entry.id === id)
            return entry;
        const inside = entry.items && findEntry(entry.items, id);
        if (inside)
            return inside;
    }
    return undefined;
}
/**
 * The entries whose lists are open, from the top, by their ids: as far as each is still found, and still has a list
 * (`items`), in the one before it.
 */
export function scopeTrail(top, path) {
    const trail = [];
    let level = top;
    for (const id of path) {
        const entry = level.find((each) => each.id === id);
        if (!entry?.items)
            break;
        trail.push(entry);
        level = entry.items;
    }
    return trail;
}
