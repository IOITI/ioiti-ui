import type { ReactNode } from 'react';
export interface DescriptionItem {
    term: ReactNode;
    details: ReactNode;
}
interface DescriptionListProps {
    items: DescriptionItem[];
    /**
     * `rows`: each term and its details on one line, the details at the end (a summary, a card).
     * `columns`: the terms in a column of their own, ruled rows (a record's details).
     * `grid`: each term over its details, in columns (figures side by side).
     * `inline`: one after the other in a sentence's flow (facts about a line of a list).
     */
    layout?: 'rows' | 'columns' | 'grid' | 'inline';
    /** For `grid`: how many columns, from a small screen up (one on a phone). */
    columns?: 2 | 3 | 4;
    /** For `columns`: the width of the terms' column. */
    termWidth?: string;
    /** Rows divided by a rule (`columns` always are). */
    divided?: boolean;
    /** A border around it, its rows divided. */
    boxed?: boolean;
    /** Tighter rows and smaller text. */
    compressed?: boolean;
    /** The details as figures: digits of one width, so that they line up. */
    numeric?: boolean;
    className?: string;
}
/**
 * Terms and their details, a `<dl>`: what a record is, a summary, figures side by side. The terms in the
 * secondary text, their details in the primary one.
 */
export declare function DescriptionList({ items, layout, columns, termWidth, divided, boxed, compressed, numeric, className, }: DescriptionListProps): import("react").JSX.Element;
export {};
