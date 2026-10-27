import { type ChartDetail } from "../../lib/chart-details.js";
export interface BarSeries {
    key: string;
    label: string;
    color?: string;
}
export type BarDatum = {
    label: string;
} & Record<string, string | number | null>;
export interface BarChartProps {
    data: BarDatum[];
    series: BarSeries[];
    /** grouped: bars side by side · stacked: bars on top of each other (changing it morphs) */
    variant?: "grouped" | "stacked";
    /**
     * ioiti-ui: `series` colours each series (one series in the series colour, things compared in the four
     * compare colours, never recycled); `sign` colours each bar by its sign, a gain's colour up and a loss's
     * down (daily gains and losses).
     */
    tone?: "series" | "sign";
    height?: number;
    formatValue?: (n: number) => string;
    formatTick?: (n: number) => string;
    /** ioiti-ui: a category's heading in the tooltip and its row in the table ("12 Oct 2026" where the axis says "12 Oct"). */
    formatTitle?: (datum: BarDatum, index: number) => string;
    /** ioiti-ui: more to say of a category, under its series' values in the tooltip and in the table. */
    details?: (datum: BarDatum, index: number) => ChartDetail[];
    /** ioiti-ui: the categories the axis names (a time axis's round moments); as many as fit otherwise. */
    tickAt?: (datum: BarDatum, index: number) => boolean;
    /** ioiti-ui: whole numbers on the value axis, for counts. */
    integer?: boolean;
    /**
     * ioiti-ui: one category set apart, a result among those it is set against (a run among random ones), for
     * one series: its bar in the series colour and a line through it, named above; the others in the muted grey.
     */
    marked?: {
        index: number;
        label: string;
    };
    showLegend?: boolean;
    /** Entrance animation (also disabled by prefers-reduced-motion) */
    animated?: boolean;
    ariaLabel?: string;
    className?: string;
}
export declare function BarChart({ data, series, variant, tone, height, formatValue, formatTick, formatTitle, details, tickAt, integer, marked, showLegend, animated, ariaLabel, className, }: BarChartProps): import("react").JSX.Element;
