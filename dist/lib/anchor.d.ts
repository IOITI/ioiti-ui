import type { CSSProperties, KeyboardEvent, RefObject } from 'react';
export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';
export type AnchorAlign = 'start' | 'center' | 'end';
export interface Rect {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
export interface Placement {
    top: number;
    left: number;
    side: AnchorSide;
    /** The room on its side: what is taller scrolls. */
    maxHeight: number;
}
/** Where a box goes beside a rectangle: on its side where there is room, on the other where there is more. */
export declare function placeBeside(anchor: Rect, box: {
    width: number;
    height: number;
}, side?: AnchorSide, align?: AnchorAlign, offset?: number, view?: {
    width: number;
    height: number;
}): Placement;
export type CloseReason = 'escape' | 'outside' | 'tab';
export interface AnchoredLayerOptions {
    open: boolean;
    onClose: (reason: CloseReason) => void;
    /** What opened it: it is placed beside it, and the focus comes back to it. */
    triggerRef: RefObject<HTMLElement | null>;
    layerRef: RefObject<HTMLElement | null>;
    /** A point to open at instead (a context menu at the pointer). */
    point?: {
        x: number;
        y: number;
    } | null;
    side?: AnchorSide;
    align?: AnchorAlign;
    offset?: number;
    /**
     * `move`: the focus goes into the layer when it opens, and back to what opened it when it closes.
     * `keep`: it stays where it is (a combobox's field, which says what the layer holds).
     */
    focus?: 'move' | 'keep';
    /** Where the focus goes in, when it moves: the layer's first control otherwise. */
    initialFocus?: () => HTMLElement | null;
}
/** The controls the keyboard reaches in an element, in order. */
export declare function focusables(root: HTMLElement): HTMLElement[];
/**
 * Places a layer beside its trigger (or a point) and keeps it there, and gives it its keys: Escape closes
 * it, a Tab past its ends closes it and goes back to the trigger, a press elsewhere closes it. Returns the
 * layer's style (hidden until placed) and the handlers for the layer's and the trigger's keys.
 */
export declare function useAnchoredLayer({ open, onClose, triggerRef, layerRef, point, side, align, offset, focus, initialFocus, }: AnchoredLayerOptions): {
    style: CSSProperties;
    side: AnchorSide;
    placed: boolean;
    measure: () => void;
    onLayerKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    onTriggerKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};
