import type { RefObject } from 'react';
export interface Shortcut {
    keys: string;
    /** What it does, in words: listed by ShortcutsDialog. Without it, it works and is not listed. */
    description?: string;
    /** The heading it is listed under: "Navigation", "Orders". */
    group?: string;
    /** Heard while text is typed too (a field, an editor): keys with ⌘ or Ctrl always are. */
    allowInInputs?: boolean;
    /** Its action; `null` for a shortcut listed and heard by someone else (a component's own ⌘B). */
    handler: ((event: KeyboardEvent) => void) | null;
    /**
     * The layer it opens (a drawer, a dialog): heard while that layer is the one open, which its keys then close, as they
     * opened it. Every other shortcut waits while a dialog is open.
     */
    layer?: () => Element | null | undefined;
}
export interface ShortcutRegistry {
    register: (shortcut: Shortcut) => () => void;
    subscribe: (listener: () => void) => () => void;
    /** The shortcuts registered, in the order they were. The same array until one comes or goes. */
    list: () => readonly Shortcut[];
}
export declare function createShortcutRegistry(): ShortcutRegistry;
export declare const ShortcutsContext: import("react").Context<ShortcutRegistry>;
/** The registry of the application's shortcuts. */
export declare function useShortcutRegistry(): ShortcutRegistry;
interface ShortcutOptions {
    description?: string;
    group?: string;
    /** Off for now: neither heard nor listed. */
    enabled?: boolean;
    allowInInputs?: boolean;
    /** The layer it opens (a drawer, a dialog's content): heard while that layer is open, to close it. */
    layer?: RefObject<Element | null>;
}
/**
 * A keyboard shortcut, heard while the component that registers it is there: `mod+k` (⌘K or Ctrl K),
 * `g o` (G, then O), `?`. Given a description, ShortcutsDialog lists it. Keys without ⌘ or Ctrl are not
 * heard while text is typed, nor any while a dialog is open but the one of the layer it opens (`layer`), which closes it.
 */
export declare function useShortcut(keys: string, handler: ((event: KeyboardEvent) => void) | null, options?: ShortcutOptions): void;
export {};
