interface RelativeTimeProps {
    /** The moment: a `Date`, milliseconds, or an ISO string. */
    value: Date | number | string;
    /** The time zone its full date is written in, in its hint; the browser's otherwise. */
    timeZone?: string;
    /**
     * The moment has happened (a last update, a message received), whatever the clocks say: one a little
     * ahead of this one, taken on a server's, is said "0 s ago", not "in 2 s".
     */
    past?: boolean;
    className?: string;
}
/**
 * A moment said from now ("3 min ago", "in 2 h"), kept true as time goes by, its full date in a hint and
 * for a screen reader. Every time on a page shares one clock for each precision (useNow).
 */
export declare function RelativeTime({ value, timeZone, past, className }: RelativeTimeProps): import("react").JSX.Element;
export {};
