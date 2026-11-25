import type { RefObject } from 'react';
export interface ScrollRegionOptions {
    /** Its name for a screen reader while it is a stop: what it holds ("Latest orders", "Code"). */
    label?: string;
    /** Or the ids of what names it (a table's own `aria-labelledby`), taken before `label`. */
    labelledBy?: string;
    /**
     * `false` for an element that is a landmark of its own (`<main>`), or has a role and a name of its own (LogViewer's
     * log): a stop, without a role or a name.
     */
    region?: boolean;
    /** What the element is drawn anew for, the ref kept (a page's frame, keyed by its page): the new one watched instead. */
    key?: unknown;
}
/** What the scrolling element is given while it is a stop: nothing while it is none. */
export interface ScrollRegionProps {
    tabIndex?: number;
    role?: 'region';
    'aria-label'?: string;
    'aria-labelledby'?: string;
}
/**
 * The attributes that make a scrolling element (`ref`'s) a stop of the keyboard while it scrolls holding no control, to
 * spread on it (see the top of this file).
 */
export declare function useScrollRegion(ref: RefObject<HTMLElement | null>, { label, labelledBy, region, key }?: ScrollRegionOptions): ScrollRegionProps;
