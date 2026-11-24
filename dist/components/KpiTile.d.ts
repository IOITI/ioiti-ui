import type { ReactNode } from 'react';
import type { GoodWhen } from '../lib/change.js';
import type { MeterTone } from './meter-tones.js';
interface KpiTileBaseProps {
    label: string;
    /** The figure. Proportional digits: tabular ones look loose at this size. */
    value: ReactNode;
    /** One line of context under the figure (the limit, the period...). */
    hint?: ReactNode;
    /**
     * The figure's change, signed and in the tone of what it means: a percentage by default, as the provider's locale
     * writes one (`2.5` is "+2.5%"; "+2,5 %" in French), what `changeFormat` writes otherwise. What it is compared with
     * is said once, by KpiGrid's `period`, or by `hint`.
     */
    change?: number;
    /** Which way is good news: `down` for a cost, a latency, a churn. Up by default. */
    goodWhen?: GoodWhen;
    /** Writes the change, signed (`(n) => formatMoney(n, 'EUR', true)`, `useFormat()`'s for the provider's locale). */
    changeFormat?: (change: number) => string;
    /** The tile that leads a row: two columns wide, its chart beside the figure from a tablet up. */
    lead?: boolean;
    /** A meter or a sparkline. */
    children?: ReactNode;
    className?: string;
}
/** A tile that needs attention: a faint tint of its tone, and always its word, never the colour alone. */
type KpiTileToneProps = {
    tone?: undefined;
    toneLabel?: undefined;
} | {
    tone: 'warning' | 'negative';
    /** What the tone says, in a word or two: "Near the limit", "Failing". */
    toneLabel: string;
};
export type KpiTileProps = KpiTileBaseProps & KpiTileToneProps;
export declare function KpiTile({ label, value, hint, change, goodWhen, changeFormat, lead, tone, toneLabel, children, className }: KpiTileProps): import("react").JSX.Element;
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
    /**
     * What the tiles' changes are compared with, said once above the row ("Compared with yesterday"), not in
     * every tile; a screen reader hears it with the tiles.
     */
    period?: ReactNode;
    /** The grid's own classes. */
    className?: string;
    children: ReactNode;
}
/**
 * Tiles side by side: two on a phone, four (or the columns asked) from a wide screen (1280 px) up. A lead
 * tile takes two of them, a whole row on a phone. Under glass, each of four tiles in a row has its glow
 * from another corner (glass.css).
 */
export declare function KpiGrid({ columns, period, className, children }: KpiGridProps): import("react").JSX.Element;
export {};
