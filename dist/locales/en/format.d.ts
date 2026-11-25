/** The formats' own words: units, and the side of now a moment is on (formatDuration, formatRelative, formatBytes…). */
export declare const format: {
    /** "190 ms". */
    milliseconds: string;
    /** "42 s". */
    seconds: string;
    /** "5 min". */
    minutes: string;
    /** "2 h 05". */
    hours: string;
    /** "4 d". */
    days: string;
    /** A moment to come: "in 5 min". */
    future: (duration: string) => string;
    /** A moment past: "18 min ago". */
    past: (duration: string) => string;
    /** "999 B". */
    bytes: string;
    /** "48.2 kB". */
    kilobytes: string;
    /** "14.0 MB". */
    megabytes: string;
    /** "2.3 GB". */
    gigabytes: string;
};
