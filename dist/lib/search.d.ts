/** A text made ready to be searched, each of its characters pointing back to the text it comes from. */
export interface Folded {
    /** The text as given. */
    source: string;
    /** In lower case, its accents taken off, a few letters written out (ß as ss, œ as oe). */
    text: string;
    /** Where each character of `text` comes from in `source`, then `source.length`. */
    from: number[];
}
/** A text in lower case, without its accents, as it is searched; each character's place in the text kept. */
export declare function fold(source: string): Folded;
/** The words of a query, as they are searched. */
export declare function searchWords(query: string): string[];
/** What an entry is found by. */
export interface Searchable {
    title: string;
    category?: string;
    description?: string;
    keywords?: readonly string[];
}
/** An entry, its texts made ready to be searched: made once for a list, not at each word typed. */
export interface Indexed<T> {
    entry: T;
    title: Folded;
    keywords: Folded[];
    category: Folded;
    description: Folded;
}
export declare function searchIndex<T extends Searchable>(entries: readonly T[]): Indexed<T>[];
/** What an entry is worth for the words typed (the most first); `null` where a word is in none of its texts. */
export declare function scoreOf(indexed: Indexed<unknown>, words: readonly string[]): number | null;
/** The entries every word typed is found in, the best first, those worth the same in the order given. */
export declare function rank<T>(index: readonly Indexed<T>[], words: readonly string[]): T[];
/**
 * Where the words typed are in a text, to mark them: each where it is found as the search finds it (the start of a
 * word first), as places in the text given, joined where they meet. A letter written as two (ß) is marked whole,
 * an accent written after its letter with it.
 */
export declare function matchRanges(source: string, words: readonly string[]): [number, number][];
