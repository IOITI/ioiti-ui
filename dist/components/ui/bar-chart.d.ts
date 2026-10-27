export interface BarSeries {
    key: string;
    label: string;
    color?: string;
}
export type BarDatum = {
    label: string;
} & Record<string, string | number>;
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
    showLegend?: boolean;
    /** Entrance animation (also disabled by prefers-reduced-motion) */
    animated?: boolean;
    ariaLabel?: string;
    className?: string;
}
export declare function BarChart({ data, series, variant, tone, height, formatValue, formatTick, showLegend, animated, ariaLabel, className, }: BarChartProps): import("react").JSX.Element;
