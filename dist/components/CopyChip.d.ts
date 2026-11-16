interface CopyChipProps {
    /** What is shown and copied: a reference, a key, an address. */
    value: string;
    /** What it is, for its button: "the key" makes "Copy the key". */
    label?: string;
    /**
     * A long value cut short: in its `middle` (an identifier, whose ends tell it apart), at its `end`, or
     * not at all. The whole of it is in a hint, and a screen reader hears it.
     */
    truncate?: 'middle' | 'end' | false;
    /** In the middle: the characters kept at its start and at its end. */
    keep?: {
        start: number;
        end: number;
    };
    className?: string;
}
/** A value to read and copy, in a chip with its copy button: a reference, an API key, a webhook's address. */
export declare function CopyChip({ value, label, truncate, keep, className }: CopyChipProps): import("react").JSX.Element;
export {};
