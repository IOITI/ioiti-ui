import type { SignTone } from '../lib/tones.js';
interface SparklineProps {
    values: number[];
    /** A line (the default), or bars from zero: a gain up, a loss down. */
    variant?: 'line' | 'bars';
    /**
     * Its colour: `auto` says the direction (a line by its last value against its first, each bar by its
     * sign), a tone (a SignTone) says one for all, `neutral` is the series colour (the accent's, where the look has one).
     * Where down is good (a delay), give the tone.
     */
    tone?: 'auto' | SignTone;
    /** In pixels. */
    width?: number;
    height?: number;
    /** What it shows ("Orders per day"): a screen reader hears it before its first, last, highest and lowest values. */
    label?: string;
    /** A value as a screen reader hears it: as the interface's locale writes it by default, whole or to two decimals. */
    format?: (value: number) => string;
    className?: string;
}
/**
 * A small line or bars, without axes, for the trend of a figure: in a KpiTile, in a table's cell. For a
 * chart that is read, `LineChart` or `BarChart`.
 */
export declare function Sparkline({ values, variant, tone, width, height, label, format: givenFormat, className, }: SparklineProps): import("react").JSX.Element | null;
export {};
