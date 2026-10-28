/**
 * The time the clock of this interval says now, as `useNow(interval)` gives it, without listening to it:
 * read up to `interval` milliseconds ago while something keeps it going.
 */
export declare function nowOf(interval: number): number;
/**
 * The time now (milliseconds since the epoch), read again every `interval` milliseconds: the components
 * asking for the same interval share one timer, which stops when none is left.
 */
export declare function useNow(interval?: number): number;
