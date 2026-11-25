import type { ComponentProps, ReactNode } from 'react';
/**
 * How tight a table is. `regular`: body-size text under a small head, rows apart by a line, for lists of
 * records in a panel. `compact`: the same in small text, for a screen of data that asks for it. `dense`:
 * body-size text in narrow cells, a line above each row, for figures side by side.
 */
export type TableDensity = 'regular' | 'compact' | 'dense';
/** The props of `Table`. */
export interface TableProps extends ComponentProps<'table'> {
    density?: TableDensity;
    /** The classes of the frame that scrolls sideways (`hidden sm:block`). */
    wrapperClassName?: string;
}
/**
 * A plain table of records or figures, as the pages write them: it scrolls sideways inside its own
 * frame when the screen is narrower than it (give it a `min-w-[40rem]` then). The frame holds all it
 * scrolls, the text of its cells for screen readers too (`sr-only`, placed absolutely): out of a frame
 * that is not positioned, that text stood beyond the page, which then scrolled sideways onto nothing.
 * While it scrolls and its cells hold no control, the frame is a stop of the keyboard, a region named
 * as the table is ("Table" in the provider's language, where it has no name).
 */
export declare function Table({ density, wrapperClassName, className, children, ...props }: TableProps): import("react").JSX.Element;
/** The props of `TableHead`: a `<thead>`'s. */
export type TableHeadProps = ComponentProps<'thead'>;
export declare function TableHead({ className, children, ...props }: TableHeadProps): import("react").JSX.Element;
/** The props of `TableBody`: a `<tbody>`'s. */
export type TableBodyProps = ComponentProps<'tbody'>;
export declare function TableBody({ className, children, ...props }: TableBodyProps): import("react").JSX.Element;
/** The props of `TableRow`: a `<tr>`'s. */
export type TableRowProps = ComponentProps<'tr'>;
export declare function TableRow({ className, ...props }: TableRowProps): import("react").JSX.Element;
interface CellProps {
    /** A figure: on the right, in digits of one width, so that a column of them lines up. */
    numeric?: boolean;
    children?: ReactNode;
}
/** The props of `TableHeaderCell`: a `<th>`'s, and whether it heads figures. */
export type TableHeaderCellProps = CellProps & ComponentProps<'th'>;
/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export declare function TableHeaderCell({ numeric, className, scope, ...props }: TableHeaderCellProps): import("react").JSX.Element;
/** The props of `TableCell`: a `<td>`'s, and whether it holds a figure. */
export type TableCellProps = CellProps & ComponentProps<'td'>;
export declare function TableCell({ numeric, className, ...props }: TableCellProps): import("react").JSX.Element;
export {};
