/**
 * The time now (milliseconds since the epoch), read again every `interval` milliseconds: the components
 * asking for the same interval share one timer, which stops when none is left.
 */
export declare function useNow(interval?: number): number;
