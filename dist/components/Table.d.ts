import type { ComponentProps, ReactNode } from 'react';
/**
 * How tight a table is. `regular`: body-size text under a small head, rows apart by a line, for lists of
 * records in a panel. `compact`: the same in small text, for a screen of data that asks for it. `dense`:
 * body-size text in narrow cells, a line above each row, for figures side by side.
 */
export type TableDensity = 'regular' | 'compact' | 'dense';
interface TableProps extends ComponentProps<'table'> {
    density?: TableDensity;
    /** The classes of the frame that scrolls sideways (`hidden sm:block`). */
    wrapperClassName?: string;
}
export declare function Table({ density, wrapperClassName, className, children, ...props }: TableProps): import("react").JSX.Element;
export declare function TableHead({ className, children, ...props }: ComponentProps<'thead'>): import("react").JSX.Element;
export declare function TableBody({ className, children, ...props }: ComponentProps<'tbody'>): import("react").JSX.Element;
export declare function TableRow({ className, ...props }: ComponentProps<'tr'>): import("react").JSX.Element;
interface CellProps {
    /** A figure: on the right, in digits of one width, so that a column of them lines up. */
    numeric?: boolean;
    children?: ReactNode;
}
/** A column's heading in the head; a row's own heading (its first cell) in the body. */
export declare function TableHeaderCell({ numeric, className, scope, ...props }: CellProps & ComponentProps<'th'>): import("react").JSX.Element;
export declare function TableCell({ numeric, className, ...props }: CellProps & ComponentProps<'td'>): import("react").JSX.Element;
export {};
