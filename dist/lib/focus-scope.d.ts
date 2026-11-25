import type { RefObject } from 'react';
export interface FocusScopeOptions {
    /** Whether the layer is open: the focus goes in as it turns true, back as it turns false or the layer goes. */
    active: boolean;
    /** What takes the focus first: what the function finds, else the first control of the layer, else the layer itself. */
    initialFocus?: () => HTMLElement | null | undefined;
    /** The focus given back to what had it before (true by default), unless it was moved elsewhere meanwhile. */
    restoreFocus?: boolean;
    /** Escape, pressed while this scope keeps the focus (holding no page: while the focus is in it), nothing inside taking it. */
    onEscape?: (event: KeyboardEvent) => void;
    /**
     * Whether the layer holds the page (true by default): Tab kept in it, its Escape heard wherever the focus is, what is
     * said said in it (announce.ts). False, the page stays in use beside it (a sheet without a backdrop): Tab goes in and
     * out of it, and its Escape is heard only while the focus is in it. Read as each key comes: it may change while open.
     */
    contain?: boolean;
    /** Whether the focus moves in as it opens (true by default): false leaves it where it is (a layer open with the page). */
    autoFocus?: boolean;
}
/**
 * The layer that keeps the focus now (the latest one opened that holds the page), if one does: what is said goes in it
 * (announce.ts).
 */
export declare function currentFocusScope(): HTMLElement | null;
/** Keeps the focus in `ref`'s element while `active` (see the top of this file). */
export declare function useFocusScope(ref: RefObject<HTMLElement | null>, { active, initialFocus, restoreFocus, onEscape, contain, autoFocus }: FocusScopeOptions): void;
