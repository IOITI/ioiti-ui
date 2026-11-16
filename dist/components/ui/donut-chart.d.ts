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
    /** Text above the total in the centre */
    centerLabel?: string;
    /**
     * ioiti-ui: the name of the segment the fifth and those after it make together: the design compares four
     * colours, never recycled (a segment given its own `color` keeps it, and nothing is grouped then).
     */
    otherLabel?: string;
    formatValue?: (n: number) => string;
    showLegend?: boolean;
    animated?: boolean;
    ariaLabel?: string;
    className?: string;
}
export declare function DonutChart({ data, variant, size, thickness, centerLabel, otherLabel, formatValue, showLegend, animated, ariaLabel, className, }: DonutChartProps): import("react").JSX.Element;
