/** The formats' own words: units, and the side of now a moment is on (formatDuration, formatRelative, formatBytes…). */
export const format = {
    /** "190 ms". */
    milliseconds: 'ms',
    /** "42 s". */
    seconds: 's',
    /** "5 min". */
    minutes: 'min',
    /** "2 h 05". */
    hours: 'h',
    /** "4 d". */
    days: 'd',
    /** A moment to come: "in 5 min". */
    future: (duration) => `in ${duration}`,
    /** A moment past: "18 min ago". */
    past: (duration) => `${duration} ago`,
    /** "999 B". */
    bytes: 'B',
    /** "48.2 kB". */
    kilobytes: 'kB',
    /** "14.0 MB". */
    megabytes: 'MB',
    /** "2.3 GB". */
    gigabytes: 'GB',
};
