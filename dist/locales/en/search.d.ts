import type { MessageKit } from '../../lib/messages.js';
/** SpotlightSearch. */
export declare const search: {
    /** "Spotlight Search": the palette's name, where the application gives none; what ⌘K is listed as. */
    label: string;
    /** "Search…": the field's placeholder, where the application gives none. */
    placeholder: string;
    /** "Search": the field's name. */
    search: string;
    /** "Search Orders": the field's name in an entry's list. */
    searchIn: (list: string) => string;
    /** "Back": the hint of the button that goes back from an entry's list, beside its key. */
    back: string;
    /** "Back from Orders": that button's name. */
    backFrom: (list: string) => string;
    /** "Close": the button drawn as Escape, which closes the palette. */
    close: string;
    /** "Recent": the heading of the entries chosen last. */
    recent: string;
    /** "Recent searches": the heading of the searches made before. */
    recentSearches: string;
    /** "Opens its list": what an entry with a list of its own says of itself. */
    opensList: string;
    /** "Searching…": said to a screen reader while entries are found. */
    searching: string;
    /** "2 results, 11 more": said to a screen reader once typing pauses; "No results" for none. */
    results: ({ count, more }: {
        count: number;
        more: number;
    }, { plural, number }: MessageKit) => string;
    /** "Orders: 2 results": the same in an entry's list, its title first. */
    inList: ({ list, results }: {
        list: string;
        results: string;
    }) => string;
    /** "No results found for “zz”": what the list says when nothing is found. */
    noResultsFor: (query: string) => string;
    /** "11 more: type to narrow them down.": the entries found past the most listed. */
    more: (count: number, { number }: MessageKit) => string;
    /** "The search failed.": what went wrong, where the application says nothing. */
    failed: string;
    /** "Try again": the button that searches again. */
    tryAgain: string;
};
