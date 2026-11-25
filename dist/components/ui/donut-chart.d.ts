export interface DonutDatum {
    label: string;
    value: number;
    color?: string;
}
export interface DonutChartProps {
    data: DonutDatum[];
    /** donut: full ring · semi: half-ring gauge */
    variant?: "donut" | "semi";
    /** Largest diameter in px (it shrinks to fit its container) */
    size?: number;
    thickness?: number;
    /** Text above the total in the centre (ioiti-ui: "Total" in the interface's language by default) */
    centerLabel?: string;
    /**
     * ioiti-ui: the name of the segment the fifth and those after it make together: the design compares four
     * colours, never recycled (a segment given its own `color` keeps it, and nothing is grouped then). "Other" in the
     * interface's language by default.
     */
    otherLabel?: string;
    /** ioiti-ui: a value, its total's too: as the interface's locale writes it by default, to a tenth ("1,234.5"). */
    formatValue?: (n: number) => string;
    showLegend?: boolean;
    animated?: boolean;
    /**
     * ioiti-ui: its name for a screen reader, and its table's caption. By default, in the interface's language, "Donut
     * chart. Total 750" ("Gauge chart…" for a gauge) and "Chart data".
     */
    "aria-label"?: string;
    className?: string;
}
export declare function DonutChart({ data, variant, size, thickness, centerLabel: givenCenterLabel, otherLabel: givenOtherLabel, formatValue: givenFormatValue, showLegend, animated, "aria-label": name, className, }: DonutChartProps): import("react").JSX.Element;
