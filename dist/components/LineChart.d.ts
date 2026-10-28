import type { ChartDetail } from '../lib/chart-details.js';
import type { MeterTone } from './meter-tones.js';
type Moment = number | string | Date;
export interface LineSeries {
    key: string;
    label: string;
    /** A colour of its own; the design's otherwise (one series in the series colour, four compared in theirs). */
    color?: string;
    /** Drawn dashed: a benchmark, a forecast. */
    dashed?: boolean;
}
/** A moment (`t`: milliseconds, a `Date` or an ISO string) and each series' value then; `null` is a gap. */
export type LinePoint = {
    t: Moment;
} & Record<string, Moment | number | null>;
export interface LineReference {
    value: number;
    label?: string;
    /** A limit's tone: `negative` for one not to cross, `warning` for one to watch. */
    tone?: MeterTone;
}
export interface LineMarker {
    t: Moment;
    label: string;
}
export interface LineChartProps {
    data: LinePoint[];
    series: LineSeries[];
    /** An area under the line, for a single series. */
    area?: boolean;
    /** Horizontal lines: a limit, a target. */
    references?: LineReference[];
    /** Moments marked across the chart: a restart, a release. */
    markers?: LineMarker[];
    /** Zero kept on the axis (a balance, a result), or the axis fitted to the values (a price, a delay). */
    zero?: boolean;
    height?: number;
    /** The time zone the times are read in. */
    timeZone?: string;
    formatValue?: (value: number) => string;
    formatTick?: (value: number) => string;
    /** The moment at the top of the tooltip. */
    formatTime?: (t: number) => string;
    /** More to say of a moment, under its series' values in the tooltip and in the table: "That day +€12.40". */
    details?: (point: LinePoint, index: number) => ChartDetail[];
    /**
     * A missing value is passed over and the line drawn through it: series measured on days of their own (runs
     * compared over the days of each). A gap in the line otherwise.
     */
    connectGaps?: boolean;
    showLegend?: boolean;
    /** Lines drawn in when they first show (not where motion is reduced). */
    animated?: boolean;
    ariaLabel?: string;
    className?: string;
}
/**
 * Values over time, up to four series compared, in the design's colours: a balance, runs side by side, a
 * delay against its limit. Its points are read by pointer or keyboard, and given to screen readers as a
 * table. For a value as it arrives, `LiveLineChart`; for categories, `BarChart`.
 */
export declare function LineChart({ data, series, area, references, markers, zero, height, timeZone, formatValue, formatTick, formatTime, details, connectGaps, showLegend, animated, ariaLabel, className, }: LineChartProps): import("react").JSX.Element;
export {};
