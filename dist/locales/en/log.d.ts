import type { MessageKit } from '../../lib/messages.js';
/** LogViewer. */
export declare const log: {
    /** "Nothing logged yet.": shown while there is no line. */
    empty: string;
    /** "Search Build log": the name of its search field, with the log's. */
    search: (label: string) => string;
    /** "Search": its search field's placeholder. */
    searchPlaceholder: string;
    /** "3 of 12": which of the lines found is in sight, among how many. */
    matchPosition: ({ index, count }: {
        index: number;
        count: number;
    }) => string;
    /** "No match": the search found nothing. */
    noMatch: string;
    /** "Previous match": the button that goes to the line found before. */
    previousMatch: string;
    /** "Previous match (Shift+Enter)": its hint, with its keys. */
    previousMatchHint: (keys: string) => string;
    /** "Next match": the button that goes to the line found after. */
    nextMatch: string;
    /** "Next match (Enter)": its hint, with its keys. */
    nextMatchHint: (keys: string) => string;
    /** "Wrap long lines": the button that wraps them, or not. */
    wrap: string;
    /** "Long lines wrapped": its hint while they are. */
    wrapped: string;
    /** "Long lines scroll sideways": its hint while they are not. */
    unwrapped: string;
    /** "Copy the log": the button that copies the lines shown. */
    copy: string;
    /** "Download the log": the button that saves them as a file. */
    download: string;
    /** "Download as build.log": its hint, with the file's name. */
    downloadAs: (name: string) => string;
    /** "25 earlier lines dropped": the lines no longer kept, above the first one shown. */
    dropped: (count: number, { plural }: MessageKit) => string;
    /** "Jump to the end": the button that follows the newest lines again. */
    jumpToEnd: string;
};
