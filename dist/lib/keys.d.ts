export interface KeyStroke {
    /** The key itself, lower case: `k`, `/`, `enter`, `arrowup`. */
    key: string;
    mod: boolean;
    ctrl: boolean;
    meta: boolean;
    alt: boolean;
    shift: boolean;
}
/** Whether the keys are an Apple computer's (⌘ for shortcuts). */
export declare function isApplePlatform(): boolean;
/** `"mod+k"` as one stroke, `"g o"` as two pressed one after the other. */
export declare function parseKeys(keys: string): KeyStroke[];
/**
 * Whether a key pressed is this stroke. A character typed with Shift (`?`) is its own key, Shift not asked
 * of it: write the character (`?`), not the keys that type it on one keyboard (`shift+/`).
 */
export declare function matchesStroke(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>, stroke: KeyStroke, apple?: boolean): boolean;
export interface KeyLabel {
    /** What is drawn on the key: `⌘`, `Ctrl`, `K`. */
    shown: string;
    /** What a screen reader says of it, when that is not what is drawn. */
    spoken?: string;
}
/** The keys of each stroke, as drawn here: modifiers first, in the order this computer writes them. */
export declare function keyLabels(keys: string, apple?: boolean): KeyLabel[][];
/** The keys in words, for a screen reader or a sentence: "Command K", "G then O". */
export declare function describeKeys(keys: string, apple?: boolean): string;
