import type { ReactNode } from 'react';
import type { GoodWhen } from '../lib/change.js';
/** One figure of a strip: what KpiTile takes. */
export interface KpiStripItem {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
    /** Its change, signed: a percentage by default (`2.5` is "+2.5%"). */
    change?: number;
    goodWhen?: GoodWhen;
    changeFormat?: (change: number) => string;
}
export interface KpiStripProps {
    items: KpiStripItem[];
    /** Its heading. */
    title?: ReactNode;
    /** What the changes are compared with, said once ("Compared with yesterday"). */
    period?: ReactNode;
    /** How many side by side on a wide screen: as many as there are figures, six at most, by default. */
    columns?: 2 | 3 | 4 | 5 | 6;
    className?: string;
}
/**
 * Secondary figures in one panel, divided by hairlines: fewer columns on a narrower screen, the hairlines
 * between them however they wrap (each figure draws its left and top ones, the frame cuts those at its
 * edge).
 */
export declare function KpiStrip({ items, title, period, columns, className }: KpiStripProps): import("react").JSX.Element;
