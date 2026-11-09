import type { ReactNode } from 'react';
import type { MeterTone } from './meter-tones.js';
interface KpiTileProps {
    label: string;
    /** The figure. Proportional digits: tabular ones look loose at this size. */
    value: ReactNode;
    /** One line of context under the figure (the limit, the period...). */
    hint?: ReactNode;
    /** A meter or a sparkline. */
    children?: ReactNode;
    className?: string;
}
export declare function KpiTile({ label, value, hint, children, className }: KpiTileProps): import("react").JSX.Element;
interface MeterProps {
    /** 0 to 1. */
    ratio: number;
    tone?: MeterTone;
    label: string;
    /** What the two ends of the bar stand for, written under it. */
    scale?: [string, string];
}
/** A single ratio against a limit. */
export declare function Meter({ ratio, tone, label, scale }: MeterProps): import("react").JSX.Element;
interface KpiGridProps {
    /** How many tiles side by side on a wide screen (1280 px; three from 1024 for five or six): four by default. */
    columns?: 2 | 3 | 4 | 5 | 6;
    className?: string;
    children: ReactNode;
}
/** Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. */
export declare function KpiGrid({ columns, className, children }: KpiGridProps): import("react").JSX.Element;
export {};
