import type { Messages } from '../locales/en.js';
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
/** The names keys are shown and said with: a catalogue's `keys` (`useMessages().keys`), English's by default. */
export type KeyWords = Messages['keys'];
/**
 * The keys of each stroke, as drawn here: modifiers first, in the order this computer writes them, named in the words
 * given (English's by default).
 */
export declare function keyLabels(keys: string, apple?: boolean, words?: KeyWords): KeyLabel[][];
/** The keys in words, for a screen reader or a sentence: "Command K", "G then O" (« Commande K », « G puis O »). */
export declare function describeKeys(keys: string, apple?: boolean, words?: KeyWords): string;
/**
 * The keys as words drawn where no key cap fits (a tooltip): "⌘B" on an Apple computer, "Ctrl B" elsewhere, "G then O"
 * for a sequence.
 */
export declare function keysText(keys: string, apple?: boolean, words?: KeyWords): string;
/**
 * The keys named in a hint's words, each stroke's joined by "+": "Shift+Enter" (« Maj+Entrée » in French), "Ctrl+Del"
 * (« Ctrl+Suppr »), "Command+K" on an Apple computer, "G then O". Named, never drawn: Enter, not ↵.
 */
export declare function keysInWords(keys: string, apple?: boolean, words?: KeyWords): string;
/**
 * The keys as `aria-keyshortcuts` names them: "Meta+B" on an Apple computer, "Control+B" elsewhere. A sequence ("g o")
 * has no such name: `undefined`.
 */
export declare function ariaKeyShortcuts(keys: string, apple?: boolean): string | undefined;
