import type { ChartDetail } from '../lib/chart-details.js';
import type { MeterTone } from './meter-tones.js';
/** A place on the x axis (`x`: a count, a distance, a step) and each key's value there; `null` is nothing there. */
export type FanPoint = {
    x: number;
} & Record<string, number | null>;
export interface FanBand {
    /** The keys of the band's lower and upper edges. */
    lower: string;
    upper: string;
    label: string;
    /** Its colour; the muted one of the charts otherwise. Bands drawn one over the other deepen it. */
    color?: string;
}
export interface FanLine {
    key: string;
    label: string;
    /** A colour of its own; the design's otherwise (one line in the series colour, more in the compare colours). */
    color?: string;
    /** Drawn dashed: what was expected, a median. */
    dashed?: boolean;
}
export interface FanReference {
    value: number;
    label?: string;
    tone?: MeterTone;
}
export interface FanMarker {
    x: number;
    label: string;
}
export interface FanChartProps {
    /** Sorted by `x`. */
    data: FanPoint[];
    /** The ranges expected, widest first: each a filled band between two keys. */
    bands: FanBand[];
    /** Lines over the bands: what was expected (dashed), what happened. */
    lines: FanLine[];
    /** Horizontal lines: a limit, zero. */
    references?: FanReference[];
    /** Places marked across the chart: when something changed. */
    markers?: FanMarker[];
    /** Zero kept on the value axis, or the axis fitted to the values. */
    zero?: boolean;
    height?: number;
    /** A value in the tooltip and the table: as the interface's locale writes it by default, to a tenth ("1,234.5"). */
    formatValue?: (value: number) => string;
    /** A tick of the value axis: compact in the interface's locale by default ("1.2k"). */
    formatTick?: (value: number) => string;
    /** A place on the x axis in words: "Trade 12"; its number as the interface's locale writes it by default. */
    formatX?: (x: number) => string;
    /** A place on the x axis on its ticks: "12"; `formatX` otherwise. */
    formatXTick?: (x: number) => string;
    /**
     * What the x axis counts, under it: "Trades"; the head of the table's first column too ("Place", in the interface's
     * language, otherwise).
     */
    xLabel?: string;
    /** More to say of a place, in the tooltip and the table. */
    details?: (point: FanPoint, index: number) => ChartDetail[];
    showLegend?: boolean;
    /** Lines drawn in when they first show (not where motion is reduced). */
    animated?: boolean;
    /**
     * Its name for a screen reader, and its table's caption. By default, in the interface's language, "Fan chart of
     * Expected, Actual" and "Chart data".
     */
    'aria-label'?: string;
    /** @deprecated Use `aria-label`. Removed in 1.0. */
    ariaLabel?: string;
    className?: string;
}
/**
 * What was expected as ranges that widen, and what happened over them: the bands of a forecast or of a
 * simulation (where 90 % and 50 % of its paths went), its median dashed, the actual line drawn as far as it
 * goes. The x axis is a count or a measure, not a time (for values over time, `LineChart`). Its places are read
 * by pointer or keyboard, and given to screen readers as a table.
 */
export declare function FanChart({ data, bands, lines, references, markers, zero, height, formatValue: givenFormatValue, formatTick: givenFormatTick, formatX: givenFormatX, formatXTick, xLabel, details, showLegend, animated, 'aria-label': givenName, ariaLabel, className, }: FanChartProps): import("react").JSX.Element;
