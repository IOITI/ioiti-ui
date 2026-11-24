/**
 * An entry chosen, as it is kept: what draws it and leads there again, nothing more (not its description, which
 * holds amounts and names).
 */
export interface RememberedEntry {
    id: string;
    title: string;
    category: string;
    href?: string;
}
/** How many entries chosen are kept, the latest first. */
export declare const REMEMBERED = 5;
/** Where a list of entries chosen is kept: under the application's key (`themeStorageKey()`), `.spotlight.<name>`. */
export declare function rememberedKey(list: string): string;
/** The entries kept under a key, the latest first: none where nothing is, or what is is not a list of entries. */
export declare function readRemembered(key: string): RememberedEntry[];
/** An entry chosen, kept first (once), the oldest beyond five forgotten: the list now kept. */
export declare function rememberEntry(key: string, entry: RememberedEntry): RememberedEntry[];
/** An entry forgotten: the list now kept (none kept once it is empty). */
export declare function forgetEntry(key: string, id: string): RememberedEntry[];
/** An entry by its id, among the entries and the lists of their entries (`items`), the first found. */
export declare function findEntry<T extends {
    id: string;
    items?: readonly T[];
}>(entries: readonly T[], id: string): T | undefined;
/**
 * The entries whose lists are open, from the top, by their ids: as far as each is still found, and still has a list
 * (`items`), in the one before it.
 */
export declare function scopeTrail<T extends {
    id: string;
    items?: readonly T[];
}>(top: readonly T[], path: readonly string[]): T[];
