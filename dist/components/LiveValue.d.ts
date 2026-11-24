interface LiveValueProps {
    /** The figure now; `null` (or `NaN`) while there is none. */
    value: number | null;
    /** Writes the figure: the provider's number by default, to two decimals unless it is whole ("18,120.50"). */
    format?: (value: number) => string;
    /** The figure is old: what sends it stopped. It is muted, and a screen reader hears that it is stale. */
    stale?: boolean;
    /** A change shows in its tone a moment: up in the gain colour, down in the loss colour. */
    flash?: boolean;
    /** Where down is good (a delay, a cost): the tones swap. */
    invert?: boolean;
    /** The word a screen reader hears for a stale figure; the provider's language's by default ("stale"). */
    staleLabel?: string;
    className?: string;
}
/**
 * A figure that changes as it is watched (a price, a queue's length): each change shows in its tone a
 * moment, then fades back; a figure gone stale is muted. A fade, so it stays where motion is reduced. For a
 * signed amount, `SignedValue`; for a count that rolls, `AnimatedNumber`.
 */
export declare function LiveValue({ value: given, format, stale, flash, invert, staleLabel: givenStaleLabel, className, }: LiveValueProps): import("react").JSX.Element;
export {};
