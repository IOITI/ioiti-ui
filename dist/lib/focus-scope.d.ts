import type { RefObject } from 'react';
export interface FocusScopeOptions {
    /** Whether the layer is open: the focus goes in as it turns true, back as it turns false or the layer goes. */
    active: boolean;
    /** What takes the focus first: what the function finds, else the first control of the layer, else the layer itself. */
    initialFocus?: () => HTMLElement | null | undefined;
    /** The focus given back to what had it before (true by default), unless it was moved elsewhere meanwhile. */
    restoreFocus?: boolean;
    /** Escape, pressed while this scope keeps the focus and nothing inside took it. */
    onEscape?: (event: KeyboardEvent) => void;
}
/** The layer that keeps the focus now (the latest one opened), if one does: what is said goes in it (announce.ts). */
export declare function currentFocusScope(): HTMLElement | null;
/** Keeps the focus in `ref`'s element while `active` (see the top of this file). */
export declare function useFocusScope(ref: RefObject<HTMLElement | null>, { active, initialFocus, restoreFocus, onEscape }: FocusScopeOptions): void;
